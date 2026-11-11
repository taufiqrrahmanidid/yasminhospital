// backend/server.js
// ============================================================
// RS YASMIN BACKEND — HARDENED VERSION
// Semua endpoint admin dilindungi requireAuth + role/permission
// ============================================================
require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const corsMiddleware = require('./middlewares/cors');
const { encrypt, decrypt, mask } = require('./utils/encryption');
const { getSetting } = require('./utils/settings');
const secureHeaders = require('./middlewares/security');
const {
    globalLimiter, loginLimiter, patientLoginLimiter,
    verifyLinkLimiter, submitLimiter, deviceLimiter, adminWriteLimiter
} = require('./middlewares/rateLimiters');
const { requireAuth, requireRole, requirePermission } = require('./middlewares/rbac');
const { requirePatientAuth } = require('./middlewares/patientAuth');

// ==================== zod ====================
const { validateBody, z } = require('./middlewares/validate');

const { daftarkanBookingKeSIMRS, cekPasienKeSIMRS } = require('./simrsBridge');
const { syncAllMasterData } = require('./simrs/masterSync');

// Generate kode booking 6 karakter (bebas karakter ambigu, aman untuk barcode/scan)
function generateBookingCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = crypto.randomBytes(6);
    let code = '';
    for (let i = 0; i < 6; i++) code += chars.charAt(bytes[i] % chars.length);
    return code;
}

// Pastikan antrean (QueueLog) ada untuk pendaftaran yang sudah diverifikasi/dijadwalkan
async function ensureQueueLog(pendaftaranId, polyclinic, queueNumber) {
    if (!queueNumber) return;
    const existing = await prisma.queueLog.findFirst({ where: { pendaftaranId } });
    if (existing) return;
    try {
        await prisma.queueLog.create({
            data: {
                pendaftaranId,
                polyclinic: polyclinic || 'Umum',
                queueNumber,
                status: 'waiting'
            }
        });
    } catch (e) {
        console.error('[QUEUE CREATE]', e.message);
    }
}

// ==================== ENV VALIDATION ====================
const JWT_SECRET = process.env.JWT_SECRET;
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL;
const DEVICE_BOOTSTRAP_SECRET = process.env.DEVICE_BOOTSTRAP_SECRET;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(s => s.trim()).filter(Boolean);

const missing = [];
if (!JWT_SECRET) missing.push('JWT_SECRET');
if (!PUBLIC_BASE_URL) missing.push('PUBLIC_BASE_URL');
if (!DEVICE_BOOTSTRAP_SECRET) missing.push('DEVICE_BOOTSTRAP_SECRET');
if (ALLOWED_ORIGINS.length === 0) missing.push('ALLOWED_ORIGINS');
if (missing.length) {
    console.error(`FATAL: env wajib tidak ditemukan: ${missing.join(', ')}`);
    process.exit(1);
}

const prisma = new PrismaClient();
const app = express();
app.disable('x-powered-by');

// Penting untuk rate limiter di balik nginx
app.set('trust proxy', 1);

// ==================== MIDDLEWARE GLOBAL ====================
app.use(secureHeaders);
app.use(corsMiddleware);
app.use(globalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== HEALTH ====================
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==================== SOCKET.IO ====================
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ALLOWED_ORIGINS,
        credentials: true
    }
});

// Socket.io auth: publik boleh connect (untuk QueueDisplay), admin harus valid token
io.use((socket, next) => {
    const token = socket.handshake.auth?.token
        || (socket.handshake.headers.authorization || '').replace('Bearer ', '');
    if (!token) return next(); // anonymous OK
    try {
        socket.data.admin = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        next();
    } catch {
        next(new Error('invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log('[SOCKET]', socket.id, socket.data.admin ? `admin=${socket.data.admin.role}` : 'anonymous');
});

// ============================================================
// HELPER: Simpan Audit Log
// ============================================================
async function logActivity(req, action, entity, entityId = null, details = null, overrideEmail = null) {
    try {
        await prisma.auditLog.create({
            data: {
                userId: req.admin?.id || null,
                userEmail: overrideEmail || req.admin?.email || 'System',
                action,
                entity,
                entityId,
                details: details ? JSON.stringify(details) : null,
                ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'] || 'Unknown'
            }
        });
    } catch (err) {
        console.error('[AUDIT LOG ERROR]', err);
    }
}

// ============================================================
// AUTH
// ============================================================
// 1. Terapkan di Login Admin
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});
app.post('/api/auth/login', loginLimiter, validateBody(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email dan password wajib diisi.' });
        }
        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Email atau sandi salah.' });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, permissions: user.permissions },
            JWT_SECRET,
            { expiresIn: '8h' }
        );
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000
        });
        await logActivity(req, 'LOGIN', 'AdminUser', user.id, { login_time: new Date().toISOString() }, user.email);
        res.json({ user: { email: user.email, name: user.name, role: user.role, permissions: user.permissions } });
    } catch (err) {
        console.error('[LOGIN ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('access_token');
    res.json({ success: true, message: 'Logout berhasil' });
});

// Cek sesi admin saat ini (untuk gerbang login frontend)
app.get('/api/auth/me', requireAuth, (req, res) => {
    res.json({ user: { id: req.admin.id, email: req.admin.email, role: req.admin.role, permissions: req.admin.permissions } });
});

// ============================================================
// ADMIN USERS
// ============================================================
app.get('/api/admin/users', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        res.json(await prisma.adminUser.findMany({
            select: { id: true, email: true, name: true, role: true, permissions: true, createdAt: true }
        }));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.post('/api/admin/users', requireAuth, requireRole('Master', 'SuperUser'), adminWriteLimiter, async (req, res) => {
    try {
        const { email, password, name, role, permissions } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email dan password wajib diisi.' });
        }
        if (typeof password !== 'string' || password.length < 12) {
            return res.status(400).json({ error: 'Password minimal 12 karakter.' });
        }
        const hash = await bcrypt.hash(password, 12);
        const newUser = await prisma.adminUser.create({
            data: {
                email,
                passwordHash: hash,
                name,
                role: role || 'User',
                permissions: Array.isArray(permissions) ? permissions : []
            }
        });
        await logActivity(req, 'CREATE_USER', 'AdminUser', newUser.id, { email, role });
        res.json({ success: true, user: { email: newUser.email, name: newUser.name, role: newUser.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Gagal membuat user (mungkin email sudah terdaftar).' });
    }
});

// ============================================================
// EDIT USER (Update Nama, Role, Permissions, & Password Opsional)
// ============================================================
app.put('/api/admin/users/:id', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        const { name, role, permissions, password } = req.body;
        
        const targetUser = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
        if (!targetUser) return res.status(404).json({ error: 'User tidak ditemukan.' });

        // Proteksi: SuperUser tidak boleh mengedit akun Master
        if (req.admin.role === 'SuperUser' && targetUser.role === 'Master') {
            return res.status(403).json({ error: 'Direktur tidak dapat mengedit akun Master/Developer.' });
        }

        const updateData = { name, role, permissions: Array.isArray(permissions) ? permissions : [] };
        
        // Jika password diisi, hash dan update. Jika kosong, biarkan password lama.
        if (password && password.trim() !== '') {
            if (password.length < 12) {
                return res.status(400).json({ error: 'Password baru minimal 12 karakter.' });
            }
            updateData.passwordHash = await bcrypt.hash(password, 12);
        }

        const updated = await prisma.adminUser.update({
            where: { id: req.params.id },
            data: updateData
        });
        await logActivity(req, 'UPDATE_USER', 'AdminUser', updated.id, { targetEmail: updated.email, role: updated.role });
        res.json({ success: true, user: { id: updated.id, email: updated.email, name: updated.name, role: updated.role } });
    } catch (err) {
        console.error('[UPDATE USER ERROR]', err);
        res.status(500).json({ error: 'Gagal mengupdate user.' });
    }
});

app.delete('/api/admin/users/:id', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        if (req.admin.id === req.params.id) {
            return res.status(400).json({ error: 'Tidak bisa menghapus akun sendiri.' });
        }
        const targetUser = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
        if (!targetUser) return res.status(404).json({ error: 'User tidak ditemukan.' });
        
        // Jika yang menghapus adalah SuperUser, dan targetnya adalah Master, tolak!
        if (req.admin.role === 'SuperUser' && targetUser.role === 'Master') {
            return res.status(403).json({ error: 'Direktur tidak dapat menghapus akun Master/Developer.' });
        }
        await prisma.adminUser.delete({ where: { id: req.params.id } });
        await logActivity(req, 'DELETE_USER', 'AdminUser', req.params.id, null);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// SYSTEM SETTINGS (Khusus Master & SuperUser)
// ============================================================
const ALLOWED_SETTINGS = {
    'GOOGLE_MAPS_API_KEY': { env: 'GOOGLE_MAPS_API_KEY', isSecret: true, label: 'Google Maps API Key' },
    'RS_YASMIN_PLACE_ID': { env: 'RS_YASMIN_PLACE_ID', isSecret: false, label: 'Place ID RS Yasmin' },
    'GOOGLE_CLIENT_ID': { env: 'GOOGLE_CLIENT_ID', isSecret: false, label: 'GBP Client ID' },
    'GOOGLE_CLIENT_SECRET': { env: 'GOOGLE_CLIENT_SECRET', isSecret: true, label: 'GBP Client Secret' },
    'GOOGLE_REFRESH_TOKEN': { env: 'GOOGLE_REFRESH_TOKEN', isSecret: true, label: 'GBP Refresh Token' },
    'GOOGLE_SYNC_PREFERENCE': { env: 'GOOGLE_SYNC_PREFERENCE', isSecret: false, label: 'Preferensi API' }
};

app.get('/api/admin/settings', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        const dbSettings = await prisma.systemSetting.findMany();
        const dbMap = Object.fromEntries(dbSettings.map(s => [s.key, s]));

        const results = [];
        for (const [key, config] of Object.entries(ALLOWED_SETTINGS)) {
            const dbValue = dbMap[key];
            let displayValue = '';
            let isSet = false;
            let source = 'none';

            if (dbValue) {
                const decrypted = decrypt(dbValue.value);
                displayValue = config.isSecret ? mask(decrypted) : (decrypted || '');
                isSet = true;
                source = 'database';
            } else if (process.env[config.env]) {
                displayValue = config.isSecret ? mask(process.env[config.env]) : process.env[config.env];
                isSet = true;
                source = 'env';
            }

            results.push({
                key,
                label: config.label,
                isSecret: config.isSecret,
                value: displayValue,
                isSet,
                source
            });
        }
        res.json(results);
    } catch (err) {
        console.error('[GET SETTINGS ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.get('/api/admin/audit-logs', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        const { limit, action, search } = req.query;
        
        let whereClause = {};
        if (action && action !== 'all') whereClause.action = action;
        if (search) {
            whereClause.OR = [
                { userEmail: { contains: search, mode: 'insensitive' } },
                { entity: { contains: search, mode: 'insensitive' } },
                { action: { contains: search, mode: 'insensitive' } }
            ];
        }

        const logs = await prisma.auditLog.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: limit ? parseInt(limit) : 100 // Default 100 data terakhir
        });
        
        res.json(logs);
    } catch (err) {
        console.error('[GET AUDIT LOGS ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.put('/api/admin/settings', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        const { settings } = req.body;
        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({ error: 'Format settings tidak valid.' });
        }

        const updated = [];
        for (const [key, value] of Object.entries(settings)) {
            const config = ALLOWED_SETTINGS[key];
            if (!config) continue; // Skip key yang tidak diizinkan

            // Jika value kosong atau sama dengan masked value, skip (tidak berubah)
            if (value === '' || value.includes('*')) continue;

            const encryptedValue = encrypt(String(value).trim());
            const existing = await prisma.systemSetting.findUnique({ where: { key } });

            await prisma.systemSetting.upsert({
                where: { key },
                update: { value: encryptedValue, updatedBy: req.admin.email },
                create: { key, value: encryptedValue, isSecret: config.isSecret, updatedBy: req.admin.email }
            });

            // Log audit (simpan versi masked saja, jangan yang asli)
            await prisma.systemSettingLog.create({
                data: {
                    settingKey: key,
                    action: existing ? 'UPDATE' : 'CREATE',
                    oldValue: existing ? mask(decrypt(existing.value) || '') : null,
                    newValue: mask(String(value).trim()),
                    changedBy: req.admin.email
                }
            });
            updated.push(key);
        }
        await logActivity(req, 'UPDATE_SETTINGS', 'SystemSetting', null, { updatedKeys: updated });
        res.json({ success: true, updated });
    } catch (err) {
        console.error('[UPDATE SETTINGS ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.get('/api/admin/settings/logs', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        const logs = await prisma.systemSettingLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// DEVICE LICENSING
// ============================================================
app.post('/api/admin/verify-device', deviceLimiter, async (req, res) => {
    try {
        const { deviceHash, deviceName, adminEmail } = req.body;
        if (!deviceHash) return res.status(400).json({ error: 'Device fingerprint tidak valid.' });

        // 🌟 PARAMETER TAMBAHAN: Cek Token Login (jika ada)
        let hasValidToken = false;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                jwt.verify(token, process.env.JWT_SECRET);
                hasValidToken = true; // Token valid!
            } catch (e) {
                // Token tidak valid / expired, abaikan
            }
        }

        const totalDevices = await prisma.adminDeviceLicense.count();
        const isFirstDevice = totalDevices === 0; 

        const license = await prisma.adminDeviceLicense.upsert({
            where: { deviceHash },
            update: { lastActive: new Date() },
            create: {
                deviceHash,
                deviceName: deviceName || (isFirstDevice ? 'PC Master (Developer)' : `PC Baru (Menunggu ACC)`),
                adminEmail: adminEmail || 'admin@rsyasmin.id',
                isAllowed: isFirstDevice 
            }
        });

        // Jika belum diizinkan, tapi punya token valid (misal sedang login sebagai Master), izinkan
        if (!license.isAllowed && !hasValidToken) {
            return res.status(403).json({ 
                authorized: false, 
                error: 'AKSES DITOLAK: Perangkat ini belum terdaftar. Silakan setujui di menu Lisensi Perangkat.' 
            });
        }
        
        res.json({ authorized: true, deviceName: license.deviceName });
    } catch (err) {
        console.error('[VERIFY DEVICE ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.get('/api/admin/devices', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        res.json(await prisma.adminDeviceLicense.findMany({ orderBy: { lastActive: 'desc' } }));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.patch('/api/admin/devices/:id/toggle', requireAuth, requireRole('Master'), async (req, res) => {
    try {
        const dev = await prisma.adminDeviceLicense.findUnique({ where: { id: req.params.id } });
        if (!dev) return res.status(404).json({ error: 'Device tidak ditemukan.' });
        const updated = await prisma.adminDeviceLicense.update({
            where: { id: req.params.id },
            data: { isAllowed: !dev.isAllowed }
        });
        await logActivity(req, 'TOGGLE_DEVICE', 'AdminDeviceLicense', req.params.id, { isAllowed: updated.isAllowed });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// ARTICLES
// ============================================================
app.get('/api/public/articles', async (req, res) => {
    try {
        res.json(await prisma.article.findMany({
            where: { isPublished: true },
            orderBy: { publishedAt: 'desc' }
        }));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.get('/api/articles', requireAuth, requirePermission('MENU_ARTICLES'), async (req, res) => {
    try {
        res.json(await prisma.article.findMany({ orderBy: { createdAt: 'desc' } }));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.post('/api/articles', requireAuth, requirePermission('ACTION_WRITE_ARTICLE'), adminWriteLimiter, async (req, res) => {
    try {
        const data = req.body;
        if (!data.title || !data.content) {
            return res.status(400).json({ error: 'Judul dan konten wajib diisi.' });
        }
        
        const baseSlug = String(data.title)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
            
        let slug = baseSlug;
        let count = 1;
        while (await prisma.article.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${count++}`;
        }

        // Explicit mapping untuk menghindari Prisma error
        const newArticle = await prisma.article.create({ 
            data: { 
                title: data.title,
                slug: slug,
                content: data.content,
                category: data.category || 'Kesehatan',
                coverImage: data.coverImage || null,
                author: data.author || 'Admin',
                isPublished: true
            } 
        });
        await logActivity(req, 'CREATE_ARTICLE', 'Article', newArticle.id, { title: newArticle.title });
        res.json({ success: true, article: newArticle });
    } catch (err) {
        console.error('[ARTICLE CREATE ERROR]', err);
        res.status(500).json({ error: `Gagal membuat artikel: ${err.message}` });
    }
});

const articleUpdateSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).optional(),
    category: z.string().max(100).optional(),
    coverImage: z.string().max(5_000_000).optional().nullable(),
    author: z.string().max(100).optional(),
    tags: z.string().max(500).optional().nullable(),
    isPublished: z.boolean().optional(),
}).strip();

app.patch('/api/articles/:id', requireAuth, requirePermission('ACTION_WRITE_ARTICLE'), adminWriteLimiter, validateBody(articleUpdateSchema), async (req, res) => {
    try {
        const updated = await prisma.article.update({
            where: { id: req.params.id },
            data: req.body
        });
        await logActivity(req, 'UPDATE_ARTICLE', 'Article', req.params.id, null);
        res.json({ success: true, article: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.patch('/api/articles/:id/toggle', requireAuth, requirePermission('ACTION_WRITE_ARTICLE'), adminWriteLimiter, async (req, res) => {
    try {
        const cur = await prisma.article.findUnique({ where: { id: req.params.id } });
        if (!cur) return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
        const updated = await prisma.article.update({
            where: { id: req.params.id },
            data: { isPublished: !cur.isPublished }
        });
        await logActivity(req, 'TOGGLE_ARTICLE', 'Article', req.params.id, { isPublished: updated.isPublished });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.delete('/api/articles/:id', requireAuth, requirePermission('ACTION_DELETE_ARTICLE'), adminWriteLimiter, async (req, res) => {
    try {
        await prisma.article.delete({ where: { id: req.params.id } });
        await logActivity(req, 'DELETE_ARTICLE', 'Article', req.params.id, null);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// INVITE LINK (admin buat link, pasien verify)
// ============================================================
app.post('/api/invite-link', requireAuth, requirePermission('MENU_PENDAFTARAN'), adminWriteLimiter, async (req, res) => {
    try {
        const { patientName, phone, passcode, durationHours, adminEmail } = req.body;
        if (!patientName || !phone || !passcode) {
            return res.status(400).json({ error: 'Nama, telepon, dan passcode wajib diisi.' });
        }
        if (typeof passcode !== 'string' || passcode.length < 6) {
            return res.status(400).json({ error: 'Passcode minimal 6 karakter.' });
        }

        const uniqueToken = `ysm-reg-${crypto.randomUUID()}`;
        const hours = Math.max(1, Math.min(Number(durationHours) || 3, 72));
        const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

        const passcodeHash = await bcrypt.hash(passcode, 12);

        await prisma.registrationInvite.create({
            data: {
                token: uniqueToken,
                patientName,
                phone,
                passcodeHash,
                expiresAt,
                adminEmail: adminEmail || req.admin.email
            }
        });

        const registrationUrl = `${PUBLIC_BASE_URL}/pendaftaran/${uniqueToken}`;
        const portalUrl = `${PUBLIC_BASE_URL}/pasien`;
        const waTemplate = `Halo Bapak/Ibu *${patientName}*, terima kasih telah menghubungi RS Yasmin Banyuwangi.\n\nSilakan lengkapi formulir pendaftaran rawat jalan Anda melalui tautan resmi berikut:\n🔗 ${registrationUrl}\n\n*Kredensial Akun Pasien Anda:*\nNo. HP : *${phone}*\nSandi  : *${passcode}*\n\n⚠️ _Tautan ini aktif selama ${hours} jam._\n\nSetelah mendaftar, Anda dapat mengecek status antrean & rekam medis di Portal Pasien:\n🌐 ${portalUrl}`;

        res.json({ success: true, token: uniqueToken, registrationUrl, waTemplate, expiresAt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.post('/api/invite-link/verify', verifyLinkLimiter, async (req, res) => {
    try {
        const { token, phoneOrName, passcode } = req.body;
        if (!token || !phoneOrName || !passcode) {
            return res.status(400).json({ error: 'Token, identitas, dan passcode wajib diisi.' });
        }
        const invite = await prisma.registrationInvite.findUnique({ where: { token } });
        if (!invite) return res.status(404).json({ error: 'Tautan tidak valid.' });

        const identityMatch =
            invite.phone === phoneOrName ||
            invite.patientName.toLowerCase() === String(phoneOrName).toLowerCase();
        const passcodeMatch = invite.passcodeHash
            ? await bcrypt.compare(passcode, invite.passcodeHash)
            : false;

        if (!identityMatch || !passcodeMatch) {
            return res.status(401).json({ error: 'Kredensial salah.' });
        }

        if (invite.isUsed) {
            const latestPendaftaran = await prisma.pendaftaran.findFirst({
                where: { phone: invite.phone },
                orderBy: { createdAt: 'desc' }
            });
            return res.json({
                valid: true, isUsed: true,
                patientName: invite.patientName, phone: invite.phone,
                pendaftaran: latestPendaftaran
            });
        }

        if (new Date() > new Date(invite.expiresAt)) {
            return res.status(410).json({ error: 'Tautan telah kedaluwarsa.' });
        }

        res.json({
            valid: true, isUsed: false,
            patientName: invite.patientName, phone: invite.phone
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// PATIENT AUTH HELPERS
// ============================================================
function signPatientToken(noIdentitas, phone) {
    return jwt.sign({ kind: 'patient', nik: noIdentitas, phone }, JWT_SECRET, { expiresIn: '12h' });
}

// Redaksi ketat untuk daftar riwayat: buang PHI paling sensitif
function redactPendaftaran(r) {
    if (!r) return null;
    const out = { ...r };
    delete out.buktiTransferImage;
    delete out.adminNotes;
    delete out.noIdentitas;
    delete out.phone;
    delete out.bankTujuan;
    return out;
}

// Redaksi untuk detail tiket milik sendiri: pertahankan nama/NIK/catatan (dipakai UI),
// buang bukti transfer base64 & nomor HP
function redactPendaftaranTicket(r) {
    if (!r) return null;
    const out = { ...r };
    delete out.buktiTransferImage;
    delete out.phone;
    delete out.bankTujuan;
    return out;
}

// ============================================================
// PATIENT LOGIN (NIK + passcode)
// ============================================================
app.post('/api/patient/login', patientLoginLimiter, async (req, res) => {
    try {
        const { nik, passcode } = req.body;
        if (!nik || !passcode) return res.status(400).json({ error: 'NIK dan Sandi wajib diisi.' });

        const cleanNik = String(nik).trim();
        const cleanPasscode = String(passcode).trim();

        const latestRecord = await prisma.pendaftaran.findFirst({
            where: { noIdentitas: cleanNik },
            orderBy: { createdAt: 'desc' }
        });
        
        if (!latestRecord) return res.status(404).json({ error: 'NIK ini belum terdaftar di sistem kami.' });

        // 1. Ambil invite TERBARU tanpa filter 'not: null' agar terhindar dari error Prisma
        const invite = await prisma.registrationInvite.findFirst({
            where: { phone: latestRecord.phone },
            orderBy: { createdAt: 'desc' }
        });
        
        // 2. Cek manual apakah hash-nya ada dan cocok
        if (!invite || !invite.passcodeHash) {
            return res.status(401).json({ error: 'Kata sandi akun salah.' });
        }

        const ok = await bcrypt.compare(cleanPasscode, invite.passcodeHash);
        if (!ok) return res.status(401).json({ error: 'Kata sandi akun salah.' });

        const bookings = await prisma.pendaftaran.findMany({
            where: { noIdentitas: cleanNik },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            token: signPatientToken(cleanNik, latestRecord.phone),
            patient: { name: latestRecord.patientName, phone: latestRecord.phone, nik: cleanNik },
            bookings: bookings.map(redactPendaftaran)
        });
    } catch (err) {
        console.error('[PATIENT LOGIN ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server saat login pasien.' });
    }
});

// Riwayat pendaftaran pasien — WAJIB token pasien, hanya milik sendiri
app.get('/api/patient/bookings', requirePatientAuth, async (req, res) => {
    try {
        const bookings = await prisma.pendaftaran.findMany({
            where: { noIdentitas: req.patient.nik },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings.map(redactPendaftaran));
    } catch (err) {
        console.error('[PATIENT BOOKINGS ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// Status tiket pasien — WAJIB token pasien & cek kepemilikan
app.get('/api/patient/ticket/:id', requirePatientAuth, async (req, res) => {
    try {
        const record = await prisma.pendaftaran.findUnique({ where: { id: req.params.id } });
        if (!record) return res.status(404).json({ error: 'Tiket pendaftaran tidak ditemukan.' });
        if (record.noIdentitas !== req.patient.nik) {
            return res.status(403).json({ error: 'Anda tidak berhak mengakses tiket ini.' });
        }
        res.json(redactPendaftaranTicket(record));
    } catch (err) {
        console.error('[PATIENT TICKET ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// SUBMIT PENDAFTARAN (atomic + validasi)
// ============================================================
app.post('/api/pendaftaran/validate-step5', submitLimiter, (req, res) => res.json({ valid: true }));

// 2. Terapkan di Submit Pendaftaran (Ganti validasi manual yang panjang)
const submitSchema = z.object({
    token: z.string().min(1),
    payload: z.object({
        patientName: z.string().min(1).max(100),
        phone: z.string().min(8).max(20),
        patientType: z.string().max(20).optional().nullable(),
        patientStatus: z.string().max(20).optional().nullable(),
        nik: z.string().max(20).optional().nullable(),
        noIdentitas: z.string().max(20).optional().nullable(),
        bpjsNumber: z.string().max(30).optional().nullable(),
        insuranceProvider: z.string().max(50).optional().nullable(),
        insuranceNumber: z.string().max(30).optional().nullable(),
        companyPartner: z.string().max(50).optional().nullable(),
        companyCardNumber: z.string().max(30).optional().nullable(),
        selectedPoli: z.string().max(100).optional().nullable(),
        selectedDoctorId: z.string().max(50).optional().nullable(),
        selectedDoctorName: z.string().max(100).optional().nullable(),
        selectedDate: z.string(),
        selectedTimeSlot: z.string(),
        metodePembayaran: z.enum(['transfer', 'bayar_di_loket']),
        bankTujuan: z.string().max(100).optional().nullable(),
        nominalBiaya: z.any().optional(),
        buktiTransferImage: z.string().optional().nullable()
    })
});
app.post('/api/pendaftaran/submit-token', submitLimiter, validateBody(submitSchema), async (req, res) => {
    try {
        const { token, payload } = req.body;
        if (!payload || typeof payload !== 'object') {
            return res.status(400).json({ error: 'Payload tidak valid.' });
        }

        // === Validasi input ===
        const name = String(payload.patientName || '').trim().slice(0, 100);
        const phone = String(payload.phone || '').replace(/\D/g, '').slice(0, 20);
        // NIK 16 digit (untuk validasi), sedangkan noIdentitas menyimpan NIK (baru) / No RM (lama)
        const nik = String(payload.nik || '').replace(/\D/g, '');
        const noIdentitas = String(payload.noIdentitas || payload.nik || '').trim();

        if (!name) return res.status(400).json({ error: 'Nama pasien wajib diisi.' });
        if (!phone) return res.status(400).json({ error: 'Nomor HP wajib diisi.' });
        if (nik && !/^\d{16}$/.test(nik)) {
            return res.status(400).json({ error: 'NIK harus 16 digit angka.' });
        }
        if (!payload.selectedDate || !payload.selectedTimeSlot) {
            return res.status(400).json({ error: 'Jadwal kunjungan wajib diisi.' });
        }

        const allowedPayment = ['transfer', 'bayar_di_loket'];
        const metode = allowedPayment.includes(payload.metodePembayaran)
            ? payload.metodePembayaran : 'transfer';

        // === 1. Simpan ke Database Lokal (Transaksi) ===
        const result = await prisma.$transaction(async (tx) => {
            let invite = null;
            if (token) {
                const claimed = await tx.registrationInvite.updateMany({
                    where: { token, isUsed: false, expiresAt: { gt: new Date() } },
                    data: { isUsed: true }
                });
                if (claimed.count !== 1) throw new Error('TOKEN_INVALID');
                invite = await tx.registrationInvite.findUnique({ where: { token } });
            }

            const poliRecord = await tx.polyclinic.findFirst({ where: { name: payload.selectedPoli } });
            const biayaFinal = poliRecord && poliRecord.price ? poliRecord.price : 135000;

            const uniqueId = 'YSM-' + crypto.randomInt(100000, 1000000);
            return tx.pendaftaran.create({
                data: {
                    id: uniqueId,
                    source: 'link_webapp',
                    status: 'baru',
                    patientName: name,
                    phone: phone,
                    patientType: payload.patientType || 'Umum',
                    patientStatus: payload.patientStatus || 'Baru',
                    noIdentitas: noIdentitas || null,
                    selectedPoli: payload.selectedPoli || 'Poli Umum',
                    selectedDoctorId: payload.selectedDoctorId || '-',
                    selectedDoctorName: payload.selectedDoctorName || '-',
                    selectedDate: payload.selectedDate,
                    selectedTimeSlot: payload.selectedTimeSlot,
                    metodePembayaran: metode,
                    bankTujuan: payload.bankTujuan || null,
                    nominalBiaya: biayaFinal,
                    buktiTransferImage: typeof payload.buktiTransferImage === 'string'
                        ? payload.buktiTransferImage.slice(0, 5_000_000) : null,
                    buktiTransferDikirim: !!payload.buktiTransferImage,
                    kodeBooking: null,
                    antrian: null
                }
            });
        });

        // Pendaftaran tersimpan dengan status 'baru' (menunggu verifikasi admin).
        // Sinkronisasi ke SIMRS & penerbitan kode booking dilakukan saat admin verifikasi.
        io.emit('DASHBOARD_UPDATED');
        res.json({ success: true, id: result.id, data: result, patientToken: signPatientToken(noIdentitas, phone) });

    } catch (err) {
        if (err.message === 'TOKEN_INVALID') {
            return res.status(403).json({ error: 'Tautan tidak valid, sudah dipakai, atau kedaluwarsa.' });
        }
        console.error('[SUBMIT ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// PENDAFTARAN LEWAT FORM WEBSITE (legacy homepage form)
// ============================================================
app.post('/api/pendaftaran', submitLimiter, async (req, res) => {
    try {
        const b = req.body || {};
        const name = String(b.patientName || '').trim().slice(0, 100);
        const phone = String(b.phone || '').replace(/\D/g, '').slice(0, 20);
        if (!name) return res.status(400).json({ error: 'Nama pasien wajib diisi.' });
        if (!phone) return res.status(400).json({ error: 'Nomor HP wajib diisi.' });

        const uniqueId = 'YSM-' + crypto.randomInt(100000, 1000000);
        const record = await prisma.pendaftaran.create({
            data: {
                id: uniqueId,
                source: 'website',
                status: 'baru',
                patientName: name,
                phone,
                patientType: b.patientType || 'Umum',
                patientStatus: b.isRegisteredPatient ? 'Lama' : 'Baru',
                noIdentitas: String(b.nik || '').replace(/\D/g, '') || null,
                selectedPoli: b.serviceType || 'Poli Umum',
                selectedDoctorId: b.selectedDoctorId || '-',
                selectedDoctorName: b.selectedDoctorId || '-',
                selectedDate: b.selectedDate || '',
                selectedTimeSlot: b.selectedTimeSlot || '',
                metodePembayaran: 'bayar_di_loket',
                buktiTransferImage: null,
                kodeBooking: null,
                antrian: null,
            }
        });
        io.emit('DASHBOARD_UPDATED');
        res.json({ success: true, id: record.id, createdAt: record.createdAt.getTime(), status: 'baru' });
    } catch (err) {
        console.error('[PENDAFTARAN FORM ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// ADMIN PENDAFTARAN
// ============================================================
app.get('/api/pendaftaran', requireAuth, requirePermission('MENU_PENDAFTARAN'), async (req, res) => {
    try {
        res.json(await prisma.pendaftaran.findMany({ orderBy: { createdAt: 'desc' } }));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.get('/api/bookings', requireAuth, requirePermission('MENU_PENDAFTARAN'), async (req, res) => {
    try {
        res.json(await prisma.pendaftaran.findMany({ orderBy: { createdAt: 'desc' } }));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.patch('/api/pendaftaran/:id/status', requireAuth, requirePermission('MENU_PENDAFTARAN'), adminWriteLimiter, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, antrian, notes, waConfirmationSent } = req.body;

        const currentItem = await prisma.pendaftaran.findUnique({ where: { id } });
        if (!currentItem) return res.status(404).json({ error: 'Data tidak ditemukan.' });

        const updateData = { status };
        if (notes !== undefined) updateData.adminNotes = notes;
        if (waConfirmationSent !== undefined) updateData.waConfirmationSent = waConfirmationSent;

        if (status === 'diverifikasi' || status === 'dijadwalkan') {
            // Regenerasi kode booking jika masih kosong ATAU masih format lama PENDING-*
            const kodeLama = currentItem.kodeBooking ? String(currentItem.kodeBooking) : '';
            if (!currentItem.kodeBooking || kodeLama.startsWith('PENDING-')) {
                const existing = await prisma.pendaftaran.findMany({
                    where: {
                        selectedDate: currentItem.selectedDate,
                        selectedTimeSlot: currentItem.selectedTimeSlot,
                        OR: [
                            { selectedDoctorId: currentItem.selectedDoctorId },
                            { selectedDoctorName: currentItem.selectedDoctorName }
                        ],
                        antrian: { not: null },
                        status: { not: 'dibatalkan' }
                    },
                    select: { antrian: true }
                });

                let highest = 0;
                existing.forEach(i => {
                    if (i.antrian) {
                        const m = i.antrian.match(/(\d+)$/);
                        if (m) highest = Math.max(highest, parseInt(m[1], 10));
                    }
                });

                updateData.kodeBooking = generateBookingCode();

                const poliName = (currentItem.selectedPoli || 'Umum').toLowerCase();
                let prefix = 'POL';
                if (poliName.includes('anak')) prefix = 'ANK';
                else if (poliName.includes('gigi')) prefix = 'GIG';
                else if (poliName.includes('kandungan')) prefix = 'KND';
                else if (poliName.includes('dalam')) prefix = 'PDL';
                else if (poliName.includes('umum')) prefix = 'UMU';

                updateData.antrian = antrian || `${prefix}-${String(highest + 1).padStart(3, '0')}`;
            } else if (antrian) {
                updateData.antrian = antrian;
            }
        }

        const updated = await prisma.pendaftaran.update({ where: { id }, data: updateData });

        // QueueLog dibuat HANYA jika belum ada (pakai antrian efektif)
        const effectiveAntrian = updateData.antrian || currentItem.antrian;
        let finalRecord = updated;
        let finalStatus = status;

        if (status === 'diverifikasi' || status === 'dijadwalkan') {
            await ensureQueueLog(id, currentItem.selectedPoli, effectiveAntrian);

            // Coba sinkronkan ke SIMRS (hanya saat admin verifikasi/menjadwalkan)
            try {
                const simrsData = await daftarkanBookingKeSIMRS(updated, effectiveAntrian);
                finalRecord = await prisma.pendaftaran.update({
                    where: { id },
                    data: {
                        kodeBooking: simrsData.kodeBooking,
                        antrian: simrsData.noAntrian,
                        status: 'diverifikasi',
                        simrsPending: false
                    }
                });
                await ensureQueueLog(id, currentItem.selectedPoli, simrsData.noAntrian);
                finalStatus = 'diverifikasi';
            } catch (simrsErr) {
                console.warn(`[SIMRS PENDING] Verifikasi ${id} tersimpan lokal. Menunggu sinkronisasi:`, simrsErr.message);
                finalRecord = await prisma.pendaftaran.update({
                    where: { id },
                    data: { simrsPending: true }
                });
                finalStatus = 'diverifikasi'; // status tetap diverifikasi (untuk KPI); flag simrsPending dipakai cron
            }
        }

        io.emit('DASHBOARD_UPDATED');
        await logActivity(req, 'UPDATE_STATUS_PENDAFTARAN', 'Pendaftaran', req.params.id, { newStatus: finalStatus });
        res.json({ success: true, item: finalRecord });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// SOCIAL FEED
// ============================================================
app.get('/api/social-feed', async (req, res) => {
    try {
        const feeds = await prisma.socialFeed.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, feeds });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.post('/api/social-feed', requireAuth, requirePermission('MENU_SOCIAL'), adminWriteLimiter, async (req, res) => {
    try {
        let { platform, title, desc, url, tag } = req.body;
        if (!platform || !url) return res.status(400).json({ error: 'Platform dan URL wajib diisi.' });

        let embedUrl = null;
        let thumbnail = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600';

        if ((platform === 'Youtube' || platform === 'YouTube') && url) {
            let videoId = '';
            if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
            else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
            if (videoId) {
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
                thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
        } else if (platform === 'Instagram') {
            thumbnail = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600';
        } else if (platform === 'Tiktok' || platform === 'TikTok') {
            const match = url.match(/video\/(\d+)/);
            if (match && match[1]) embedUrl = `https://www.tiktok.com/embed/v2/${match[1]}`;
            try {
                const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=${url}`);
                const oembedData = await oembedRes.json();
                if (oembedData.thumbnail_url) {
                    thumbnail = oembedData.thumbnail_url;
                    if (!title || title === 'Postingan Terbaru RS Yasmin') title = oembedData.title.substring(0, 100);
                }
            } catch {
                thumbnail = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600';
            }
        } else if (platform === 'Facebook') {
            thumbnail = 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600';
        }

        const newFeed = await prisma.socialFeed.create({
            data: {
                id: `feed-${Date.now()}`,
                platform,
                title: title || 'Postingan Terbaru RS Yasmin',
                desc: desc || '',
                url, embedUrl, thumbnail,
                tag: tag || 'Edukasi',
                dateStr: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
            }
        });
        res.json({ success: true, feed: newFeed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.post('/api/social-feed/sync-youtube', requireAuth, requirePermission('MENU_SOCIAL'), adminWriteLimiter, async (req, res) => {
    try {
        const { channelId, limit } = req.body;
        if (!channelId) return res.status(400).json({ error: 'Channel ID wajib diisi.' });

        const cleanId = channelId.trim();
        const rssUrl = cleanId.startsWith('UC')
            ? `https://www.youtube.com/feeds/videos.xml?channel_id=${cleanId}`
            : `https://www.youtube.com/feeds/videos.xml?user=${cleanId.replace('@', '')}`;

        const response = await fetch(rssUrl);
        const xmlText = await response.text();
        const entries = xmlText.split('<entry>').slice(1);
        const maxLimit = Math.min(Number(limit) || 5, 20);
        let count = 0;

        await prisma.socialFeed.deleteMany({
            where: { OR: [{ platform: 'Youtube' }, { platform: 'YouTube' }] }
        });

        for (const entry of entries) {
            if (count >= maxLimit) break;
            const vId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
            const t = entry.match(/<title>(.*?)<\/title>/);
            const d = entry.match(/<media:description>(.*?)<\/media:description>/);
            const p = entry.match(/<published>(.*?)<\/published>/);

            if (vId && t) {
                const videoId = vId[1];
                const published = p ? new Date(p[1]) : new Date();
                await prisma.socialFeed.create({
                    data: {
                        id: `feed-yt-${Date.now()}-${count}`,
                        platform: 'Youtube',
                        title: t[1],
                        desc: d ? d[1].substring(0, 150) + '...' : 'Video edukasi terbaru dari RS Yasmin.',
                        url: `https://www.youtube.com/watch?v=${videoId}`,
                        embedUrl: `https://www.youtube.com/embed/${videoId}`,
                        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                        tag: 'Edukasi',
                        dateStr: published.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
                    }
                });
                count++;
            }
        }
        io.emit('DASHBOARD_UPDATED');
        res.json({ success: true, count });
    } catch (err) {
        console.error('[YT SYNC]', err);
        res.status(500).json({ error: 'Gagal menarik data YouTube.' });
    }
});

app.delete('/api/social-feed/:id', requireAuth, requirePermission('MENU_SOCIAL'), adminWriteLimiter, async (req, res) => {
    try {
        await prisma.socialFeed.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// REVIEWS (public baca, admin kelola)
// ============================================================
app.get('/api/reviews', async (req, res) => {
    try {
        res.json(await prisma.googleReview.findMany({
            where: { isVisible: true },
            orderBy: { dateStr: 'desc' }
        }));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.get('/api/admin/reviews', requireAuth, requirePermission('MENU_REVIEWS'), async (req, res) => {
    try {
        const { limit, startDate, endDate, minRating, sortBy } = req.query;

        const where = {};
        
        // Filter Tanggal
        if (startDate && endDate) {
            where.publishTime = { equals: new Date(startDate), lte: new Date(endDate) };
        }
        
        // Filter Bintang
        if (minRating) {
            where.rating = { equals: Number(minRating) };
        }

        // Urutan
        const orderBy = sortBy === 'rating' ? { rating: 'desc' } : { publishTime: 'desc' };

        const reviews = await prisma.googleReview.findMany({
            where,
            orderBy,
            take: limit ? Number(limit) : undefined,
        });

        res.json(reviews);
    } catch (err) {
        console.error('[GET REVIEWS ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// Data ulasan riil pasien (jika API Google limit)
// const REAL_RS_YASMIN_REVIEWS_BACKUP = [
    // { authorName: 'Agus Hanief', rating: 5, time: 1723284000, relativeTime: '1 bulan lalu', text: 'Pelayanan ramah dan sigap cepat saat persalinan buah hati kami dengan metode ERACS...', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
    // { authorName: 'Nabella Intan', rating: 5, time: 1722592800, relativeTime: '1 bulan lalu', text: 'Pelayanan oke banget. Dokter anak dan staf administrasinya sangat ramah...', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120' },
    // { authorName: 'Ryann Clark', rating: 5, time: 1722160800, relativeTime: '1 bulan lalu', text: 'The staff were very kind, welcoming, and efficient...', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' },
    // { authorName: 'Christoffer Staune Bakmann', rating: 5, time: 1721037600, relativeTime: '2 bulan lalu', text: 'Went here to get the health certificate for Kawah Ijen...', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120' },
    // { authorName: 'Drs. Suparno', rating: 5, time: 1719309600, relativeTime: '2 bulan lalu', text: 'Kontrol berkala poli spesialis jantung di RS Yasmin sangat memuaskan...', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120' }
// ];

// ============================================================
// ENDPOINT: Ambil Statistik Agregat dari Google Maps
// ============================================================
app.get('/api/google-stats', async (req, res) => {
    try {
        const PLACE_ID = process.env.RS_YASMIN_PLACE_ID;
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        
        if (!API_KEY || !PLACE_ID) {
            return res.status(500).json({ error: 'Konfigurasi Google Maps API belum lengkap.' });
        }

        const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=id`;
        const resp = await fetch(url, {
            method: 'GET',
            headers: { 
                'X-Goog-Api-Key': API_KEY, 
                'X-Goog-FieldMask': 'rating,userRatingCount'
            }
        });
        
        const data = await resp.json();

        if (!resp.ok) {
            console.error('[GMAPS STATS ERROR]', data);
            return res.status(resp.status).json({ error: data.error?.message || 'Gagal menarik statistik dari Google API' });
        }

        // Kirim data ke frontend
        res.json({ 
            averageRating: data.rating || 0,
            totalReviews: data.userRatingCount || 0
        });

    } catch (err) { 
        console.error('[STATS ERROR]', err); 
        res.status(500).json({ error: err.message || 'Kesalahan internal server.' }); 
    }
});

// ============================================================
// HELPER: Sync Google Business Profile API (Opsi A)
// ============================================================
async function syncFromGBP() {
    const CLIENT_ID = await getSetting('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_ID');
    const CLIENT_SECRET = await getSetting('GOOGLE_CLIENT_SECRET', 'GOOGLE_CLIENT_SECRET');
    const REFRESH_TOKEN = await getSetting('GOOGLE_REFRESH_TOKEN', 'GOOGLE_REFRESH_TOKEN');
    
    if (!CLIENT_ID || !REFRESH_TOKEN) {
        throw new Error('Kredensial GBP belum dikonfigurasi.');
    }
    
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, 'http://localhost:8000/api/auth/google/callback');
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const mybusiness = google.mybusinessaccountmanagement({ version: 'v1', auth: oauth2Client });
    const accountsRes = await mybusiness.accounts.list();
    const accountName = accountsRes.data.accounts[0].name; 

    const locationsApi = google.mybusinessbusinessinformation({ version: 'v1', auth: oauth2Client });
    const locationsRes = await locationsApi.accounts.locations.list({ parent: accountName });
    const locationName = locationsRes.data.locations[0].name;

    const reviewsApi = google.mybusinessreviews({ version: 'v4', auth: oauth2Client });
    let pageToken = null;
    let count = 0;

    do {
        const response = await reviewsApi.accounts.locations.reviews.list({
            parent: `${accountName}/${locationName}`,
            pageSize: 50,
            pageToken: pageToken,
            orderBy: 'updateTime desc',
        });

        const reviews = response.data.reviews || [];
        
        for (const rev of reviews) {
            const updateTime = new Date(rev.updateTime);
            const reviewId = rev.reviewId;

            await prisma.googleReview.upsert({
                where: { id: reviewId },
                update: {},
                create: {
                    id: reviewId,
                    authorName: rev.reviewer.displayName || 'Anonim',
                    authorPhoto: rev.reviewer.profilePhotoUrl || '',
                    rating: rev.starRating,
                    comment: rev.comment || '',
                    relativeTime: '', 
                    dateStr: updateTime.toISOString().split('T')[0],
                    publishTime: updateTime,
                    source: 'google_business_profile',
                    isVisible: true,
                },
            });
            count++;
        }
        pageToken = response.data.nextPageToken;
    } while (pageToken);

    return { success: true, total: count, source: 'gbp' };
}

// ============================================================
// HELPER: Sync Places API (Opsi B)
// ============================================================
async function syncFromPlaces() {
    const PLACE_ID = await getSetting('RS_YASMIN_PLACE_ID', 'RS_YASMIN_PLACE_ID');
    const API_KEY = await getSetting('GOOGLE_MAPS_API_KEY', 'GOOGLE_MAPS_API_KEY');
    
    if (!API_KEY || !PLACE_ID) {
        throw new Error('API Key atau Place ID belum dikonfigurasi (cek menu Pengaturan Sistem).');
    }

    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=id`;
    const resp = await fetch(url, {
        method: 'GET',
        headers: { 'X-Goog-Api-Key': API_KEY, 'X-Goog-FieldMask': 'reviews' }
    });
    
    const data = await resp.json();

    if (!resp.ok) throw new Error(data.error?.message || 'Gagal API Places');

    let count = 0;
    if (data.reviews && data.reviews.length > 0) {
        for (const rev of data.reviews) {
            if (!rev.publishTime) continue; 
            const publishTime = new Date(rev.publishTime);
            const reviewId = `gmaps-${publishTime.getTime()}`;
            
            await prisma.googleReview.upsert({
                where: { id: reviewId }, 
                update: {}, 
                create: {
                    id: reviewId,
                    authorName: rev.authorAttribution?.displayName || 'Anonim',
                    authorPhoto: rev.authorAttribution?.photoUri || '',
                    rating: rev.rating || 5,
                    relativeTime: rev.relativePublishTimeDescription || 'Baru',
                    dateStr: publishTime.toISOString().split('T')[0],
                    publishTime: publishTime,
                    comment: rev.text?.text || '',
                    isVisible: true,
                    source: 'google_places'
                }
            });
            count++;
        }
    }
    return { success: true, total: count, source: 'places' };
}

// ============================================================
// ENDPOINT: SMART SYNC (Otomatis pilih API terbaik)
// ============================================================
app.post('/api/sync-google-smart', requireAuth, requirePermission('MENU_REVIEWS'), adminWriteLimiter, async (req, res) => {
    const preference = await getSetting('GOOGLE_SYNC_PREFERENCE', 'GOOGLE_SYNC_PREFERENCE') || 'auto';
    let result = null;

    console.log(`[SMART SYNC] Memulai sinkronisasi dengan preferensi: ${preference}`);

    // Strategi 1: Coba GBP jika preferensi gbp/auto
    if (preference === 'gbp' || preference === 'auto') {
        try {
            console.log('[SMART SYNC] Mencoba Google Business Profile API...');
            result = await syncFromGBP();
            console.log(`[SMART SYNC] Sukses via GBP. Total: ${result.total}`);
        } catch (err) {
            console.warn(`[SMART SYNC] GBP Gagal: ${err.message}`);
            // Jika preferensi mutlak 'gbp' dan gagal, jangan fallback (kembalikan error)
            if (preference === 'gbp') {
                return res.status(500).json({ error: 'GBP Sync Gagal: ' + err.message });
            }
        }
    }

    // Strategi 2: Fallback ke Places API jika GBP gagal atau preferensi 'places'
    if (!result) {
        try {
            console.log('[SMART SYNC] Mencoba Google Places API...');
            result = await syncFromPlaces();
            console.log(`[SMART SYNC] Sukses via Places. Total: ${result.total}`);
        } catch (err) {
            console.error(`[SMART SYNC] Places Juga Gagal: ${err.message}`);
            return res.status(500).json({ error: 'Kedua API gagal sinkronisasi. ' + err.message });
        }
    }

    io.emit('REVIEWS_UPDATED');
    await logActivity(req, 'SYNC_GOOGLE_REVIEWS', 'GoogleReview', null, { 
        totalSynced: result.total, 
        source: result.source 
    });
    res.json(result);
});

app.delete('/api/reviews', requireAuth, requireRole('Master'), async (req, res) => {
    try {
        await prisma.googleReview.deleteMany();
        await logActivity(req, 'CLEAR_REVIEWS', 'GoogleReview', null, null);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.patch('/api/reviews/:id/toggle', requireAuth, requirePermission('MENU_REVIEWS'), adminWriteLimiter, async (req, res) => {
    try {
        const cur = await prisma.googleReview.findUnique({ where: { id: req.params.id } });
        if (!cur) return res.status(404).json({ error: 'Review tidak ditemukan.' });
        await logActivity(req, 'TOGGLE_REVIEW', 'GoogleReview', req.params.id, null);
        res.json(await prisma.googleReview.update({
            where: { id: req.params.id },
            data: { isVisible: !cur.isVisible }
        }));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// ENDPOINT: Terima Laporan Saran & Pengaduan Pasien
// ============================================================
app.post('/api/feedback', async (req, res) => {
    try {
        const { patientId, kesan, messages, attachments } = req.body;

        if (!patientId || !messages || messages.length === 0) {
            return res.status(400).json({ error: 'Data laporan tidak lengkap.' });
        }

        // Simpan ke database
        const newFeedback = await prisma.patientFeedback.create({
            data: {
                patientId: String(patientId).trim(),
                kesan,
                messages,
                attachments: attachments || [],
                status: 'unread'
            }
        });

        console.log(`[FEEDBACK] Laporan baru dari Pasien ID: ${patientId}`);
        
        res.json({ success: true, id: newFeedback.id });
    } catch (err) {
        console.error('[FEEDBACK ERROR]', err);
        res.status(500).json({ error: 'Gagal menyimpan laporan ke server.' });
    }
});

// ============================================================
// ADMIN: Ambil Semua Laporan Pasien
// ============================================================
app.get('/api/admin/feedback', requireAuth, requirePermission('MENU_PATIENT_FEEDBACK'), async (req, res) => {
    try {
        const feedbacks = await prisma.patientFeedback.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(feedbacks);
    } catch (err) {
        console.error('[GET FEEDBACK ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// ADMIN: Update Status Laporan (Unread -> Read -> Resolved)
// ============================================================
app.patch('/api/admin/feedback/:id/status', requireAuth, requirePermission('MENU_PATIENT_FEEDBACK'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['unread', 'read', 'resolved'].includes(status)) {
            return res.status(400).json({ error: 'Status tidak valid.' });
        }

        const updated = await prisma.patientFeedback.update({
            where: { id: req.params.id },
            data: { status }
        });
        await logActivity(req, 'UPDATE_FEEDBACK_STATUS', 'PatientFeedback', req.params.id, { newStatus: status });
        res.json({ success: true, data: updated });
    } catch (err) {
        console.error('[UPDATE FEEDBACK ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// KPI DASHBOARD DATA (Real-time from Database)
// ============================================================
app.get('/api/admin/kpi/:menu', requireAuth, async (req, res) => {
    try {
        const { menu } = req.params;
        const { timeframe, dateStr } = req.query;

        if (!dateStr) return res.status(400).json({ error: 'Parameter dateStr wajib diisi.' });

        const baseDate = new Date(dateStr);
        if (isNaN(baseDate.getTime())) return res.status(400).json({ error: 'Format tanggal tidak valid.' });

        let startDate, endDate, prevStartDate, prevEndDate;

        // Kalkulasi rentang waktu berdasarkan Timeframe
        if (timeframe === 'Daily') {
            startDate = new Date(baseDate.setHours(0,0,0,0));
            endDate = new Date(baseDate.setHours(23,59,59,999));
            prevStartDate = new Date(startDate); prevStartDate.setDate(prevStartDate.getDate() - 1);
            prevEndDate = new Date(endDate); prevEndDate.setDate(prevEndDate.getDate() - 1);
        } else if (timeframe === 'Weekly') {
            startDate = new Date(baseDate.setHours(0,0,0,0)); // baseDate is Monday
            endDate = new Date(baseDate); endDate.setDate(endDate.getDate() + 6); endDate.setHours(23,59,59,999);
            prevStartDate = new Date(startDate); prevStartDate.setDate(prevStartDate.getDate() - 7);
            prevEndDate = new Date(endDate); prevEndDate.setDate(prevEndDate.getDate() - 7);
        } else { // Monthly
            startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1, 0, 0, 0, 0);
            endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0, 23, 59, 59, 999);
            prevStartDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1, 0, 0, 0, 0);
            prevEndDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 0, 23, 59, 59, 999);
        }

        const manualRecords = await prisma.kpiRecord.findMany({
            where: {
                kpiCode: menu,
                periodDate: { gte: startDate, lte: endDate }
            }
        });

        if (manualRecords.length > 0) {
            // Jika ada data manual, format ke standar Frontend
            const manualMetrics = manualRecords.map(r => ({
                label: r.metricKey.replace(/_/g, ' ').toUpperCase(), // Format key jadi label
                value: r.value,
                change: 'Manual',
                trend: 'neutral',
                sub: 'Diinput oleh Admin'
            }));

            // Kembalikan data manual dan HENTIKAN pencarian data lokal
            return res.json({
                metrics: manualMetrics,
                chartData: [], 
                tableRows: [['Data Manual', '-', '-', '-', 'Tercatat']],
                recommendations: ['Data ini diinput secara manual karena belum terhubung ke API SIMRS.']
            });
        }

        if (menu === 'KPI_RAWAT_JALAN') {
            const currentCount = await prisma.pendaftaran.count({ where: { createdAt: { gte: startDate, lte: endDate } } });
            const prevCount = await prisma.pendaftaran.count({ where: { createdAt: { gte: prevStartDate, lte: prevEndDate } } });

            // Hitung Tren
            let trendChange = '0%'; let trendDir = 'neutral';
            if (prevCount > 0) {
                const diff = ((currentCount - prevCount) / prevCount) * 100;
                trendChange = (diff > 0 ? '+' : '') + diff.toFixed(1) + '%';
                trendDir = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
            } else if (currentCount > 0) {
                trendChange = '+100%'; trendDir = 'up';
            }

            const cancelledPatients = await prisma.pendaftaran.count({ where: { status: 'dibatalkan', createdAt: { gte: startDate, lte: endDate } } });

            const reviews = await prisma.googleReview.aggregate({ _avg: { rating: true }, where: { isVisible: true } });
            const avgRating = reviews._avg.rating ? reviews._avg.rating.toFixed(1) : '0.0';

            // Hitung Waktu Tunggu
            const queueLogs = await prisma.queueLog.findMany({
                where: { calledAt: { not: null }, createdAt: { gte: startDate, lte: endDate } },
                select: { createdAt: true, calledAt: true }
            });
            let totalWaitMinutes = 0;
            queueLogs.forEach(log => { totalWaitMinutes += (new Date(log.calledAt).getTime() - new Date(log.createdAt).getTime()) / 60000; });
            let avgWaitTime = queueLogs.length > 0 ? (totalWaitMinutes / queueLogs.length).toFixed(0) : '14';

            // Hitung Tabel
            const groupByPoli = await prisma.pendaftaran.groupBy({
                by: ['selectedPoli'], _count: { id: true }, where: { createdAt: { gte: startDate, lte: endDate } }, orderBy: { _count: { id: 'desc' } }, take: 5
            });
            const tableRowsPromises = groupByPoli.map(async (item) => {
                const doctorCount = await prisma.doctor.count({ where: { subSpecialty: item.selectedPoli, status: 'Aktif' } });
                return [ item.selectedPoli || 'Poli Umum', item._count.id.toString(), avgWaitTime + ' m', doctorCount > 0 ? `${doctorCount} Dokter` : 'Belum ada jadwal', item._count.id > 5 ? 'Sangat Baik' : 'Baik' ];
            });
            const tableRows = await Promise.all(tableRowsPromises);

            // Rekomendasi Dinamis
            const dynamicRecommendations = [];
            if (parseInt(avgWaitTime) > 15) dynamicRecommendations.push(`Waktu tunggu rata-rata (${avgWaitTime} menit) melebihi target 15 menit.`);
            else dynamicRecommendations.push(`Waktu tunggu aman (${avgWaitTime} menit). Pertahankan efisiensi alur pelayanan.`);
            if (currentCount === 0) dynamicRecommendations.push("Belum ada kunjungan pada periode ini. Pastikan mesin antrean dan tautan pendaftaran online aktif.");
            else if (trendDir === 'up') dynamicRecommendations.push(`Terjadi kenaikan kunjungan sebesar ${trendChange} dibanding periode sebelumnya.`);
            else dynamicRecommendations.push("Kunjungan stabil atau menurun. Fokus pada peningkatan mutu pelayanan.");

            // Data Grafik
            let chartData = [];
            if (timeframe === 'Daily') {
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(startDate); d.setDate(d.getDate() - i);
                    const s = new Date(d.setHours(0,0,0,0)); const e = new Date(d.setHours(23,59,59,999));
                    const c = await prisma.pendaftaran.count({ where: { createdAt: { gte: s, lte: e } } });
                    chartData.push({ label: d.toLocaleDateString('id-ID', { weekday: 'short' }), value: c, target: 20 });
                }
            } else if (timeframe === 'Weekly') {
                for (let i = 0; i < 7; i++) {
                    const d = new Date(startDate); d.setDate(d.getDate() + i);
                    const s = new Date(d.setHours(0,0,0,0)); const e = new Date(d.setHours(23,59,59,999));
                    const c = await prisma.pendaftaran.count({ where: { createdAt: { gte: s, lte: e } } });
                    chartData.push({ label: d.toLocaleDateString('id-ID', { weekday: 'short' }), value: c, target: 20 });
                }
            } else { // Monthly (4 Minggu)
                for (let i = 0; i < 4; i++) {
                    const s = new Date(startDate); s.setDate(s.getDate() + (i * 7));
                    const e = new Date(s); e.setDate(e.getDate() + 6); e.setHours(23,59,59,999);
                    const c = await prisma.pendaftaran.count({ where: { createdAt: { gte: s, lte: e } } });
                    chartData.push({ label: `Mgg ${i+1}`, value: c, target: 50 });
                }
            }

            res.json({
                metrics: [
                    { label: 'Total Pasien', value: currentCount.toString(), change: trendChange, trend: trendDir, sub: 'vs periode sebelumnya' },
                    { label: 'Avg. Waktu Tunggu', value: avgWaitTime + ' Menit', change: '-2%', trend: 'up', sub: 'Target < 15 menit' },
                    { label: 'Kepuasan Pasien', value: avgRating + ' / 5.0', change: '+1%', trend: 'up', sub: 'Berdasarkan Google Review' },
                    { label: 'Pasien Batal', value: cancelledPatients.toString(), change: '0%', trend: 'neutral', sub: 'Target < 2%' }
                ],
                chartData: chartData,
                tableRows: tableRows.length > 0 ? tableRows : [['Belum Ada Data', '0', '-', '-', '-']],
                recommendations: dynamicRecommendations
            });
        } else if (menu === 'KPI_BED_MANAGEMENT') {
            // Ambil semua data kamar dari database
            const rooms = await prisma.room.findMany();
            
            const totalBed = rooms.reduce((sum, r) => sum + r.capacity, 0);
            const occupiedBed = rooms.reduce((sum, r) => sum + r.occupied, 0);
            const availableBed = totalBed - occupiedBed;
            const borPercentage = totalBed > 0 ? ((occupiedBed / totalBed) * 100).toFixed(1) : '0';

            // Format Tabel
            const tableRows = rooms.map(r => [
                r.name,
                r.class,
                r.capacity.toString(),
                r.occupied.toString(),
                (r.capacity - r.occupied).toString(),
                `${((r.occupied / r.capacity) * 100).toFixed(1)}%`
            ]);

            // Format Grafik (5 Kamar Teratas)
            const chartData = rooms.slice(0, 5).map(r => ({
                label: r.name.substring(0, 10), // Potong nama agar muat di grafik
                value: r.occupied,
                target: r.capacity
            }));

            // Rekomendasi Dinamis
            const dynamicRecommendations = [];
            if (parseFloat(borPercentage) > 85) {
                dynamicRecommendations.push("BOR di atas 85%. Waspadai penumpukan pasien dan risiko infeksi nosokomial. Siapkan bed cadangan.");
            } else if (parseFloat(borPercentage) < 60) {
                dynamicRecommendations.push("BOR di bawah 60%. Optimalkan promosi layanan rawat inap dan efisiensi operasional.");
            } else {
                dynamicRecommendations.push("BOR dalam batas ideal (60-85%). Pertahankan manajemen alokasi tempat tidur.");
            }

            res.json({
                metrics: [
                    { label: 'Tempat Tidur Total', value: totalBed.toString(), change: 'Stabil', trend: 'neutral', sub: 'Kapasitas RS' },
                    { label: 'Bed Terisi', value: occupiedBed.toString(), change: `${borPercentage}%`, trend: 'up', sub: 'BOR Aktif' },
                    { label: 'Bed Kosong', value: availableBed.toString(), change: 'Tersedia', trend: 'neutral', sub: 'Siap digunakan' },
                    { label: 'Rata-rata BOR', value: `${borPercentage}%`, change: '+1%', trend: 'up', sub: 'Target 60-85%' }
                ],
                chartData: chartData.length > 0 ? chartData : [{ label: 'No Data', value: 0, target: 0 }],
                tableRows: tableRows.length > 0 ? tableRows : [['Belum Ada Data Kamar', '-', '0', '0', '0', '0%']],
                recommendations: dynamicRecommendations
            });

        } else if (menu === 'KPI_ANTRIAN') {
            // Hitung metrik antrean hari ini
            const todayStart = new Date(baseDate.setHours(0,0,0,0));
            const todayEnd = new Date(baseDate.setHours(23,59,59,999));

            const totalQueues = await prisma.queueLog.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } });
            const waitingQueues = await prisma.queueLog.count({ where: { status: 'waiting', createdAt: { gte: todayStart, lte: todayEnd } } });
            const completedQueues = await prisma.queueLog.count({ where: { status: 'completed', createdAt: { gte: todayStart, lte: todayEnd } } });

            // Format Tabel (Per Poli)
            const queueByPoli = await prisma.queueLog.groupBy({
                by: ['polyclinic'],
                _count: { id: true },
                where: { createdAt: { gte: todayStart, lte: todayEnd } },
                orderBy: { _count: { id: 'desc' } },
                take: 5
            });

            const tableRowsPromises = queueByPoli.map(async (q) => {
                const waiting = await prisma.queueLog.count({ where: { polyclinic: q.polyclinic, status: 'waiting' } });
                const completed = await prisma.queueLog.count({ where: { polyclinic: q.polyclinic, status: 'completed' } });
                return [
                    q.polyclinic,
                    q._count.id.toString(),
                    waiting.toString(),
                    completed.toString(),
                    waiting > 5 ? 'Padat' : 'Kondusif'
                ];
            });
            const tableRows = await Promise.all(tableRowsPromises);

            // Data Grafik (Antrean per Jam)
            const chartData = [];
            for (let h = 8; h <= 16; h++) {
                const startHour = new Date(todayStart); startHour.setHours(h, 0, 0, 0);
                const endHour = new Date(todayStart); endHour.setHours(h, 59, 59, 999);
                const count = await prisma.queueLog.count({ where: { createdAt: { gte: startHour, lte: endHour } } });
                chartData.push({ label: `${h}:00`, value: count, target: 10 });
            }

            res.json({
                metrics: [
                    { label: 'Total Antrean', value: totalQueues.toString(), change: '+0%', trend: 'neutral', sub: 'Hari ini' },
                    { label: 'Sedang Menunggu', value: waitingQueues.toString(), change: 'Live', trend: 'neutral', sub: 'Status: Waiting' },
                    { label: 'Selesai Dilayani', value: completedQueues.toString(), change: '+5%', trend: 'up', sub: 'Status: Completed' },
                    { label: 'Rata-rata Waktu', value: '14 Menit', change: '-2%', trend: 'up', sub: 'Waktu Tunggu' }
                ],
                chartData: chartData,
                tableRows: tableRows.length > 0 ? tableRows : [['Belum Ada Antrean', '0', '0', '0', '-']],
                recommendations: [
                    "Pantau kepadatan antrean pada jam sibuk (09:00 - 11:00).",
                    "Pastikan display antrean (TV) terhubung dengan baik ke sistem."
                ]
            });
        } else {
            return res.json({
                metrics: [
                    { label: 'Data KPI', value: '-', change: '0%', trend: 'neutral', sub: 'Belum ada data' },
                    { label: 'Status', value: 'Manual', change: '0%', trend: 'neutral', sub: 'Silakan input manual' }
                ],
                chartData: [],
                tableRows: [['Belum Ada Data', '-', '-', '-', '-']],
                recommendations: [
                    'Data untuk KPI ini belum tersedia di database lokal.',
                    'Silakan klik tombol "Input Manual" di pojok kanan atas untuk mengisi data.'
                ]
            });
        }
    } catch (err) {
        console.error('[KPI API ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// SIMPAN DATA KPI MANUAL
// ============================================================
app.post('/api/admin/kpi/manual', requireAuth, requireRole('Master', 'SuperUser', 'User'), async (req, res) => {
    try {
        const { kpiCode, dateStr, metrics } = req.body;
        
        if (!kpiCode || !dateStr || !metrics || !Array.isArray(metrics)) {
            return res.status(400).json({ error: 'Data input tidak lengkap.' });
        }

        const periodDate = new Date(dateStr);
        periodDate.setHours(0, 0, 0, 0);

        for (const item of metrics) {
            // Abaikan field jika kosong
            if (!item.value || String(item.value).trim() === '') continue;

            const existingRecord = await prisma.kpiRecord.findUnique({
                where: {
                    kpiCode_metricKey_periodDate: {
                        kpiCode, metricKey: item.key, periodDate
                    }
                }
            });

            let finalValue = String(item.value);

            // Jika data sudah ada, cek apakah bisa dijumlahkan (keduanya angka)
            if (existingRecord) {
                const oldNum = parseFloat(existingRecord.value);
                const newNum = parseFloat(item.value);
                
                if (!isNaN(oldNum) && !isNaN(newNum)) {
                    finalValue = String(oldNum + newNum); // 👈 Penjumlahan angka
                }
            }

            await prisma.kpiRecord.upsert({
                where: {
                    kpiCode_metricKey_periodDate: { kpiCode, metricKey: item.key, periodDate }
                },
                update: { value: finalValue, source: 'manual', updatedAt: new Date() },
                create: { kpiCode, metricKey: item.key, value: finalValue, periodDate, source: 'manual' }
            });
        }
        await logActivity(req, 'INPUT_KPI_MANUAL', 'KpiRecord', kpiCode, { date: dateStr, metricsCount: metrics.length });
        res.json({ success: true, message: 'Data KPI manual berhasil disimpan.' });
    } catch (err) {
        console.error('[SAVE KPI MANUAL ERROR]', err);
        res.status(500).json({ error: 'Gagal menyimpan data KPI manual.' });
    }
});

// ============================================================
// CEK PASIEN KE SIMRS (dipakai wizard pendaftaran untuk pasien lama)
// ============================================================
app.post('/api/simrs/check-patient', submitLimiter, async (req, res) => {
    try {
        const { token, noRM, nik } = req.body || {};
        if (!token) return res.status(400).json({ message: 'Token undangan wajib diisi.' });
        if (!noRM && !nik) {
            return res.status(400).json({ message: 'No. RM atau NIK wajib diisi.' });
        }

        // Validasi token undangan — mencegah enumerasi data pasien lewat No. RM
        const invite = await prisma.registrationInvite.findUnique({ where: { token } });
        if (!invite) return res.status(403).json({ message: 'Token undangan tidak valid.' });
        if (invite.isUsed) return res.status(410).json({ message: 'Token undangan sudah dipakai.' });
        if (new Date() > new Date(invite.expiresAt)) return res.status(410).json({ message: 'Token undangan kedaluwarsa.' });

        const raw = await cekPasienKeSIMRS(noRM, nik);
        const payload = raw && (raw.data || raw);
        const nama = payload && (payload.nama || payload.name || payload.patientName);
        if (!payload || !nama) {
            return res.status(404).json({ message: 'Data pasien tidak ditemukan di SIMRS.' });
        }

        // Verifikasi kepemilikan: HP pada data SIMRS harus cocok dengan HP undangan
        const normalizePhone = (p) => String(p || '').replace(/\D/g, '').replace(/^62/, '0');
        const simrsPhone = normalizePhone(payload.phone || payload.noHP);
        const invitePhone = normalizePhone(invite.phone);
        if (simrsPhone && invitePhone && simrsPhone !== invitePhone) {
            return res.status(404).json({ message: 'Data pasien tidak ditemukan di SIMRS.' });
        }

        res.json({
            data: {
                nama,
                nik: payload.nik || '',
                noRM: payload.noRM || noRM || '',
                noBPJS: payload.noBPJS || '',
                asuransiProvider: payload.asuransiProvider || '',
                noAsuransi: payload.noAsuransi || '',
                perusahaanPartner: payload.perusahaanPartner || '',
                noPegawai: payload.noPegawai || '',
            },
        });
    } catch (err) {
        const belum = /belum dikonfigurasi/i.test(String(err.message || ''));
        res.status(502).json({
            message: belum ? 'SIMRS belum tersambung.' : 'Gagal memeriksa data ke SIMRS.',
        });
    }
});

// ============================================================
// SINKRONISASI MASTER DATA DARI SIMRS (Sumber B)
// ============================================================
app.post('/api/simrs/sync-master', requireAuth, requireRole('Master', 'SuperUser'), adminWriteLimiter, async (req, res) => {
    try {
        const { results, errors } = await syncAllMasterData();
        await logActivity(req, 'SYNC_MASTER_FROM_SIMRS', 'MasterData', null, { results, errors });
        res.json({ success: errors.length === 0, results, errors });
    } catch (err) {
        console.error('[SIMRS MASTER SYNC]', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ============================================================
// MASTER DATA (public reads)
// ============================================================
app.get('/api/rs_info', async (req, res) => {
    try { res.json(await prisma.hospitalInfo.findUnique({ where: { id: 'hospital_info' } }) || {}); }
    catch { res.json({}); }
});
app.get('/api/doctors', async (req, res) => {
    try { res.json(await prisma.doctor.findMany()); } catch { res.json([]); }
});

app.get('/api/doctors/quota-check', async (req, res) => {
    try {
        const { doctorId, date, timeSlot } = req.query;
        if (!doctorId || !date || !timeSlot) {
            return res.json({ totalQuota: 30, used: 0, remaining: 30, isFull: false });
        }

        // 1. Ambil data dokter untuk melihat kuota dari jadwalnya
        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
        let totalQuota = 30; // Default jika tidak diset
        if (doctor && doctor.schedule && typeof doctor.schedule === 'object') {
            const schedule = doctor.schedule;
            if (schedule.quota) totalQuota = schedule.quota;
        }

        // 2. Hitung berapa yang sudah mendaftar di poli & jam tersebut
        const used = await prisma.pendaftaran.count({
            where: {
                selectedDoctorId: doctorId,
                selectedDate: date,
                selectedTimeSlot: timeSlot,
                status: { notIn: ['dibatalkan'] }
            }
        });

        const remaining = Math.max(0, totalQuota - used);
        res.json({ totalQuota, used, remaining, isFull: remaining <= 0 });
    } catch (err) {
        console.error('[QUOTA CHECK ERROR]', err);
        res.json({ totalQuota: 30, used: 0, remaining: 30, isFull: false });
    }
});

// ============================================================
// BANK ACCOUNTS (Metode Pembayaran)
// ============================================================
app.get('/api/banks', async (req, res) => {
    try {
        // Endpoint publik: Hanya menampilkan bank yang aktif untuk pasien
        res.json(await prisma.bankAccount.findMany({ where: { isActive: true } }));
    } catch (err) { res.status(500).json({ error: 'Kesalahan server.' }); }
});

app.get('/api/admin/banks', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        // Endpoint admin: Menampilkan semua bank (termasuk yang nonaktif)
        res.json(await prisma.bankAccount.findMany({ orderBy: { bankName: 'asc' } }));
    } catch (err) { res.status(500).json({ error: 'Kesalahan server.' }); }
});

app.post('/api/admin/banks', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        const { bankName, accountNumber, accountHolder } = req.body;
        if (!bankName || !accountNumber || !accountHolder) return res.status(400).json({ error: 'Data tidak lengkap.' });
        
        const newBank = await prisma.bankAccount.create({
            data: { bankName, accountNumber, accountHolder }
        });
        res.json({ success: true, data: newBank });
    } catch (err) { res.status(500).json({ error: 'Gagal menambah bank.' }); }
});

app.put('/api/admin/banks/:id', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        const { bankName, accountNumber, accountHolder, isActive } = req.body;
        const updated = await prisma.bankAccount.update({
            where: { id: req.params.id },
            data: { bankName, accountNumber, accountHolder, isActive }
        });
        res.json({ success: true, data: updated });
    } catch (err) { res.status(500).json({ error: 'Gagal mengupdate bank.' }); }
});

app.delete('/api/admin/banks/:id', requireAuth, requireRole('Master', 'SuperUser'), async (req, res) => {
    try {
        await prisma.bankAccount.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Gagal menghapus bank.' }); }
});

app.get('/api/rooms', async (req, res) => {
    try { res.json(await prisma.room.findMany()); } catch { res.json([]); }
});
app.get('/api/polyclinics', async (req, res) => {
    try { res.json(await prisma.polyclinic.findMany()); } catch { res.json([]); }
});

app.get('/api/insurance_partners', async (req, res) => {
    try { res.json(await prisma.insurancePartner.findMany({ orderBy: { name: 'asc' } })); } 
    catch { res.json([]); }
});

app.get('/api/specialists', async (req, res) => {
    try { res.json(await prisma.specialist.findMany()); } catch { res.json([]); }
});

app.get('/api/specialist_categories', async (req, res) => {
    try {
        const categories = await prisma.specialistCategory.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(categories);
    } catch (err) {
        console.error('[GET CATEGORIES ERROR]', err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

app.get('/api/announcements', async (req, res) => {
    try { res.json(await prisma.announcement.findMany()); } catch { res.json([]); }
});
app.get('/api/social_media', async (req, res) => {
    try { res.json(await prisma.socialMedia.findMany()); } catch { res.json([]); }
});

app.post('/api/save/rs_info/hospital_info', requireAuth, requireRole('Master', 'SuperUser'), adminWriteLimiter, async (req, res) => {
    try {
        const data = req.body;
        
        // 1. Ambil data lama dari database sebelum diubah
        const oldInfo = await prisma.hospitalInfo.findUnique({ where: { id: 'hospital_info' } });

        // 2. Simpan/Update data baru
        const updated = await prisma.hospitalInfo.upsert({
            where: { id: 'hospital_info' },
            update: {
                name: data.name || 'RS Yasmin',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || '',
                whatsapp: data.whatsapp || '',
                accreditation: data.accreditation || '',
                logo: data.logo || null,
                youtubeChannelId: data.youtubeChannelId || null
            },
            create: {
                id: 'hospital_info',
                name: data.name || 'RS Yasmin',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || '',
                whatsapp: data.whatsapp || '',
                accreditation: data.accreditation || '',
                logo: data.logo || null,
                youtubeChannelId: data.youtubeChannelId || null
            }
        });

        // 3. Cari tahu apa saja yang berubah (Diff)
        const changes = {};
        if (oldInfo) {
            if (oldInfo.name !== data.name) changes.name = data.name;
            if (oldInfo.address !== data.address) changes.address = data.address;
            if (oldInfo.phone !== data.phone) changes.phone = data.phone;
            if (oldInfo.email !== data.email) changes.email = data.email;
            if (oldInfo.whatsapp !== data.whatsapp) changes.whatsapp = data.whatsapp;
            if (oldInfo.accreditation !== data.accreditation) changes.accreditation = data.accreditation;
            if (oldInfo.logo !== data.logo) changes.logo_updated = true; // Hanya true jika logo benar-benar diganti
        }

        // 4. Hanya catat ke log jika ada yang berubah
        if (Object.keys(changes).length > 0) {
            await logActivity(req, 'UPDATE_RS_INFO', 'HospitalInfo', 'hospital_info', changes);
        }

        res.json({ success: true, data: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kesalahan internal server.' });
    }
});

// ============================================================
// MASTER DATA CRUD — save (upsert) & delete per collection
// ============================================================
const MASTER_DATA_CONFIG = {
    doctors: {
        model: 'doctor',
        idField: 'id',
        fields: ['name','specialty','subSpecialty','gender','speciali','experience','rating',
                 'bpjs','education','bio','image','status','gradGradDate','licenseNumber',
                 'specGradDate','specLicenseNumber','joinDate','leaveFromDate','leaveToDate','schedule']
    },
    polyclinics: {
        model: 'polyclinic',
        idField: 'code',
        fields: ['name','status','price','activeSinceDate','inactiveSinceDate']
    },
    specialists: {
        model: 'specialist',
        idField: 'code',
        fields: ['name','description']
    },
    specialist_categories: {
        model: 'specialistCategory',
        idField: 'id',
        fields: ['name']
    },
    rooms: {
        model: 'room',
        idField: 'id',
        fields: ['type','name','class','capacity','occupied','facilities']
    },
    announcements: {
        model: 'announcement',
        idField: 'id',
        fields: ['title','image','isActive','activeDate','closeDate']
    },
    social_media: {
        model: 'socialMedia',
        idField: 'id',
        fields: ['platform','url','icon']
    },
    insurance_partners: {
        model: 'insurancePartner',
        idField: 'id',
        fields: ['name','type']
    }
};

// ============================================================
// MASTER DATA CRUD — save (upsert) per collection
// ============================================================
app.post('/api/save/:collection/:id', requireAuth, requireRole('Master', 'SuperUser'), adminWriteLimiter, async (req, res) => {
    try {
        const { collection, id } = req.params;
        const config = MASTER_DATA_CONFIG[collection];
        if (!config) {
            return res.status(400).json({ error: `Collection '${collection}' tidak diizinkan.` });
        }

        // 1. Bangun Skema Zod dinamis
        const schemaShape = {};
        config.fields.forEach(field => {
            schemaShape[field] = z.any().optional();
        });
        // TAMBAHKAN INI: Izinkan idField masuk agar tidak ditolak .strict()
        schemaShape[config.idField] = z.any().optional(); 
        
        const dynamicSchema = z.object(schemaShape).strip();
        
        // 2. Bersihkan body dari idField (karena ID sudah diambil dari URL parameter)
        const payload = { ...req.body };
        delete payload[config.idField];

        // 3. Validasi
        const parseResult = dynamicSchema.safeParse(payload);
        if (!parseResult.success) {
            return res.status(400).json({ 
                error: 'Input ditolak karena tidak valid atau berisi field terlarang.', 
                details: parseResult.error.flatten() // Mengembalikan detail error yang jelas
            });
        }

        // 4. Simpan ke database
        const modelClient = prisma[config.model];
        const record = await modelClient.upsert({
            where: { [config.idField]: id },
            update: parseResult.data,
            create: { ...parseResult.data, [config.idField]: id }
        });
        await logActivity(req, 'SAVE_MASTER_DATA', collection, id, { action: 'upsert' });
        res.json({ success: true, data: record });
    } catch (err) {
        console.error('[SAVE ERROR]', err);
        res.status(500).json({ error: `Gagal menyimpan: ${err.message}` });
    }
});

// ============================================================
// Endpoint untuk sinkronisasi banyak data sekaligus (Bulk Sync)
// ============================================================
app.post('/api/sync/:collection', requireAuth, requireRole('Master', 'SuperUser'), adminWriteLimiter, async (req, res) => {
    try {
        const { collection } = req.params;
        const items = req.body.items;
        
        if (!Array.isArray(items)) return res.status(400).json({ error: 'Items harus berupa array' });
        
        const config = MASTER_DATA_CONFIG[collection];
        if (!config) return res.status(400).json({ error: 'Collection tidak valid' });
        
        // 1. Bangun Skema Zod dinamis
        const schemaShape = {};
        config.fields.forEach(field => {
            schemaShape[field] = z.any().optional();
        });
        schemaShape[config.idField] = z.any().optional(); // Izinkan idField
        
        const dynamicSchema = z.object(schemaShape).strip();
        
        const modelClient = prisma[config.model];
        let savedCount = 0;

        // 2. Loop, validasi, dan simpan
        for (const item of items) {
            const id = item[config.idField];
            if (!id) continue;

            const payload = { ...item };
            delete payload[config.idField];

            const parseResult = dynamicSchema.safeParse(payload);
            if (!parseResult.success) {
                console.warn(`[SYNC SKIP] Item ${id} ditolak:`, parseResult.error.flatten());
                continue; // Lewati item ini jika ada data aneh
            }

            await modelClient.upsert({
                where: { [config.idField]: id },
                update: parseResult.data,
                create: { ...parseResult.data, [config.idField]: id }
            });
            savedCount++;
        }
        res.json({ success: true, count: savedCount });
    } catch (err) {
        console.error('[SYNC ERROR]', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/delete/:collection/:id', requireAuth, requireRole('Master', 'SuperUser'), adminWriteLimiter, async (req, res) => {
    try {
        const { collection, id } = req.params;
        const config = MASTER_DATA_CONFIG[collection];
        if (!config) {
            return res.status(400).json({ error: `Collection '${collection}' tidak diizinkan.` });
        }
        const modelClient = prisma[config.model];
        await modelClient.delete({ where: { [config.idField]: id } });
        await logActivity(req, 'DELETE_MASTER_DATA', collection, id, null);
        res.json({ success: true });
    } catch (err) {
        console.error('[DELETE ERROR]', err);
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Data tidak ditemukan.' });
        }
        res.status(500).json({ error: `Gagal menghapus: ${err.message}` });
    }
});

// ============================================================
// QUEUE MANAGEMENT
// ============================================================
const queueRoutes = require('./routes/queue');
app.use('/api/queue', queueRoutes);

// ============================================================
// ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
    // Origin tidak diizinkan oleh CORS → 403 (bukan 500)
    if (err && err.message === 'CORS_DENIED') {
        return res.status(403).json({ error: 'Origin tidak diizinkan.' });
    }
    console.error('[UNHANDLED]', err);
    res.status(500).json({ error: 'Kesalahan internal server.' });
});

// ============================================================
// CRON JOB: Sinkronisasi Google Places Otomatis (Setiap hari 02:00)
// ============================================================
cron.schedule('0 2 * * *', async () => {
    console.log('[CRON] Menjalankan sinkronisasi ulasan otomatis...');
    const preference = process.env.GOOGLE_SYNC_PREFERENCE || 'auto';
    
    try {
        if ((preference === 'gbp' || preference === 'auto') && process.env.GOOGLE_REFRESH_TOKEN) {
            await syncFromGBP();
            console.log('[CRON] Sinkronisasi GBP selesai.');
        } else if (process.env.GOOGLE_MAPS_API_KEY) {
            await syncFromPlaces();
            console.log('[CRON] Sinkronisasi Places selesai.');
        }
    } catch (err) {
        console.error('[CRON ERROR]', err);
        // Fallback jika GBP gagal
        if (process.env.GOOGLE_MAPS_API_KEY) {
            try { await syncFromPlaces(); } catch (e) {}
        }
    }
});

// ============================================================
// CRON JOB: Sinkronisasi Pendaftaran PENDING ke SIMRS
// (Berjalan setiap 15 menit)
// ============================================================
cron.schedule('*/15 * * * *', async () => {
    console.log('[CRON] Memeriksa pendaftaran PENDING ke SIMRS...');
    
    try {
        // Cari pendaftaran yang masih berstatus PENDING
        const pendingRegistrations = await prisma.pendaftaran.findMany({
            where: {
                simrsPending: true
            },
            take: 10 // Batasi 10 per batch agar tidak membebani server
        });

        if (pendingRegistrations.length === 0) {
            return console.log('[CRON] Tidak ada data PENDING.');
        }

        console.log(`[CRON] Ditemukan ${pendingRegistrations.length} data PENDING. Mencoba sinkronisasi...`);

        for (const reg of pendingRegistrations) {
            try {
                const simrsData = await daftarkanBookingKeSIMRS(reg, reg.antrian);
                
                await prisma.pendaftaran.update({
                    where: { id: reg.id },
                    data: {
                        kodeBooking: simrsData.kodeBooking,
                        antrian: simrsData.noAntrian,
                        status: 'diverifikasi',
                        simrsPending: false
                    }
                });
                await ensureQueueLog(reg.id, reg.selectedPoli, simrsData.noAntrian);
                
                console.log(`[CRON SUCCESS] ${reg.id} berhasil disinkronkan. Kode: ${simrsData.kodeBooking}`);
                io.emit('DASHBOARD_UPDATED');
            } catch (err) {
                console.warn(`[CRON PENDING] ${reg.id} masih gagal disinkronkan.`);
                // Biarkan tetap PENDING, akan dicoba lagi 15 menit kemudian
            }
        }
    } catch (err) {
        console.error('[CRON ERROR]', err);
    }
});

// ============================================================
// START
// ============================================================
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 BACKEND RS YASMIN PORT ${PORT}`));