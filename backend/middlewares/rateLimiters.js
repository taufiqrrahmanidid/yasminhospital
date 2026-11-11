const rateLimit = require('express-rate-limit');

const message = (msg) => ({ error: msg });

// Global — untuk semua request. Longgar.
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000, // Dinaikkan agar development lancar
    standardHeaders: true,
    legacyHeaders: false,
    message: message('Terlalu banyak request. Coba lagi dalam beberapa menit.')
});

// Login admin — ketat untuk mencegah brute force
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, 
    message: message('Terlalu banyak percobaan login. Coba lagi 15 menit.')
});

// Login pasien
const patientLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: message('Terlalu banyak percobaan. Coba lagi 15 menit.')
});

// Verifikasi invite link
const verifyLinkLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: message('Terlalu banyak percobaan. Coba lagi 15 menit.')
});

// Submit pendaftaran
const submitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: message('Terlalu banyak percobaan submit. Coba lagi 15 menit.')
});

// Device verify — DILONGGARKAN (50 request / 15 menit)
const deviceLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, 
    standardHeaders: true,
    legacyHeaders: false,
    message: message('Terlalu banyak percobaan verifikasi perangkat. Coba lagi 15 menit.')
});

// Aksi tulis admin
const adminWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: message('Terlalu banyak aksi tulis. Coba lagi 15 menit.')
});

module.exports = {
    globalLimiter,
    loginLimiter,
    patientLoginLimiter,
    verifyLinkLimiter,
    submitLimiter,
    deviceLimiter,
    adminWriteLimiter
};