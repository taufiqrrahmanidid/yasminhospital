// backend/middlewares/rbac.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * requireAuth: verifikasi JWT dari header Authorization.
 * Juga mendukung httpOnly cookie (untuk Tahap 6, opsional).
 */
const requireAuth = (req, res, next) => {
    let token = null;
    
    // Cek cookie terlebih dahulu (Cara baru)
    if (req.cookies && req.cookies.access_token) {
        token = req.cookies.access_token;
    }
    // Fallback ke header Authorization (Untuk backward compatibility / testing)
    else {
        const auth = req.headers.authorization;
        if (auth && auth.startsWith('Bearer ')) {
            token = auth.slice(7);
        }
    }

    if (!token) return res.status(401).json({ error: 'Autentikasi diperlukan.' });

    try {
        req.admin = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Sesi tidak valid atau kedaluwarsa.' });
    }
};

/**
 * requireRole: hanya role tertentu yang boleh lanjut.
 * Contoh: requireRole('Master') atau requireRole('Master', 'SuperUser')
 */
const requireRole = (...roles) => (req, res, next) => {
    if (!req.admin) {
        return res.status(401).json({ error: 'Autentikasi diperlukan.' });
    }
    if (!roles.includes(req.admin.role)) {
        return res.status(403).json({ error: 'Akses ditolak: role tidak mencukupi.' });
    }
    next();
};

/**
 * requirePermission: hanya yang punya permission spesifik (dari JWT).
 * Role Master otomatis bypass semua.
 */
const requirePermission = (perm) => (req, res, next) => {
    if (!req.admin) {
        return res.status(401).json({ error: 'Autentikasi diperlukan.' });
    }
    if (req.admin.role === 'Master') {
        return next(); // Master bypass
    }
    const perms = Array.isArray(req.admin.permissions) ? req.admin.permissions : [];
    if (!perms.includes(perm)) {
        return res.status(403).json({ error: `Akses ditolak: butuh permission '${perm}'.` });
    }
    next();
};

/**
 * requireAnyPermission: user perlu minimal salah satu permission.
 * Berguna untuk endpoint yang dipakai lintas modul.
 */
const requireAnyPermission = (...perms) => (req, res, next) => {
    if (!req.admin) return res.status(401).json({ error: 'Autentikasi diperlukan.' });
    if (req.admin.role === 'Master') return next();
    const userPerms = Array.isArray(req.admin.permissions) ? req.admin.permissions : [];
    if (!perms.some(p => userPerms.includes(p))) {
        return res.status(403).json({ error: 'Akses ditolak: permission tidak mencukupi.' });
    }
    next();
};

module.exports = { requireAuth, requireRole, requirePermission, requireAnyPermission };