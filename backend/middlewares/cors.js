// backend/middlewares/cors.js
const cors = require('cors');

// Whitelist dari env — comma-separated. WAJIB di-set.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

if (ALLOWED_ORIGINS.length === 0) {
    console.error('[CORS] FATAL: ALLOWED_ORIGINS kosong. Semua request dengan Origin akan ditolak.');
}

console.log('[CORS] Whitelist:', ALLOWED_ORIGINS.join(', ') || '(kosong)');

module.exports = cors({
    origin: (origin, callback) => {
        // Request tanpa Origin (curl, server-to-server, health check) → izinkan
        if (!origin) return callback(null, true);

        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }

        console.warn(`[CORS] Ditolak: Origin="${origin}". Whitelist: ${ALLOWED_ORIGINS.join(', ')}`);
        callback(new Error('CORS_DENIED'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});