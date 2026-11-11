const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.SETTINGS_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    console.warn('[SECURITY] SETTINGS_ENCRYPTION_KEY tidak valid (harus 64 hex chars). Fitur Settings akan gagal.');
}

function encrypt(text) {
    if (!text) return null;
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

function decrypt(encryptedText) {
    if (!encryptedText) return null;
    try {
        const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(ivHex, 'hex'));
        decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        console.error('[DECRYPT ERROR]', e.message);
        return null;
    }
}

function mask(value) {
    if (!value) return '';
    if (value.length <= 8) return '****';
    return `${value.substring(0, 6)}${'*'.repeat(Math.min(12, value.length - 10))}${value.substring(value.length - 4)}`;
}

module.exports = { encrypt, decrypt, mask };