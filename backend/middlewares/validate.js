const { z } = require('zod');

const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ 
            error: 'Validasi gagal', 
            details: result.error.flatten().fieldErrors 
        });
    }
    req.body = result.data; // Timpa req.body dengan data yang sudah bersih dan tervalidasi
    next();
};

module.exports = { validateBody, z };