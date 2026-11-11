// backend/middlewares/patientAuth.js
// Autentikasi pasien via JWT (kind: 'patient') — terpisah dari token admin.
const jwt = require('jsonwebtoken');

function requirePatientAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Autentikasi diperlukan.' });
  }
  try {
    const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (payload.kind !== 'patient') throw new Error('bukan token pasien');
    req.patient = payload; // { kind, nik, phone }
    next();
  } catch {
    return res.status(401).json({ error: 'Sesi tidak valid atau kedaluwarsa.' });
  }
}

module.exports = { requirePatientAuth };
