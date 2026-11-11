const { decrypt } = require('./encryption');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Ambil nilai setting dari DB (decrypt), fallback ke .env jika tidak ada
 * @param {string} dbKey - Key di tabel SystemSetting
 * @param {string} envKey - Nama variabel di .env
 */
async function getSetting(dbKey, envKey) {
    try {
        const setting = await prisma.systemSetting.findUnique({ where: { key: dbKey } });
        if (setting && setting.value) {
            const decrypted = decrypt(setting.value);
            if (decrypted) return decrypted;
        }
    } catch (e) {
        console.warn(`[SETTINGS] Gagal baca ${dbKey} dari DB, fallback ke env:`, e.message);
    }
    return process.env[envKey] || null;
}

module.exports = { getSetting };