const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { requireAuth, requireRole } = require('../middlewares/rbac');
const router = express.Router();

// SSE clients pool
const sseClients = new Map();

// Redaksi untuk layar publik (TV display): TANPA data pasien
function publicQueue(q) {
  return {
    id: q.id,
    queueNumber: q.queueNumber,
    polyclinic: q.polyclinic,
    status: q.status,
    loketNumber: q.loketNumber,
    calledAt: q.calledAt,
    completedAt: q.completedAt,
  };
}

// Subset aman pasien untuk panel staff (tanpa NIK/bukti transfer/catatan admin)
function safePendaftaran(p) {
  if (!p) return null;
  return {
    patientName: p.patientName,
    phone: p.phone,
    selectedDoctorName: p.selectedDoctorName,
    selectedPoli: p.selectedPoli,
  };
}

// GET /api/queue/active - antrean aktif per poli (staff/login saja)
router.get('/active', requireAuth, requireRole('Master', 'SuperUser', 'User'), async (req, res) => {
  try {
    const { poli } = req.query;
    const queues = await prisma.queueLog.findMany({
      where: {
        polyclinic: poli || undefined,
        status: { in: ['waiting', 'called', 'serving'] }
      },
      orderBy: { createdAt: 'asc' }
    });

    const enriched = await Promise.all(queues.map(async (q) => {
      const pendaftaran = await prisma.pendaftaran.findUnique({ where: { id: q.pendaftaranId } });
      return { ...q, pendaftaran: safePendaftaran(pendaftaran) };
    }));

    res.json({ success: true, queues: enriched });
  } catch (error) {
    console.error('[QUEUE] Error fetching active:', error);
    res.status(500).json({ success: false, error: 'Kesalahan internal server.' });
  }
});

// POST /api/queue/call - panggil pasien berikutnya (staff/admin saja)
router.post('/call', requireAuth, requireRole('Master', 'SuperUser', 'User'), async (req, res) => {
  try {
    const { queueId, loketNumber, calledBy } = req.body;
    const updated = await prisma.queueLog.update({
      where: { id: queueId },
      data: {
        status: 'called',
        calledAt: new Date(),
        calledBy: calledBy || 'admin',
        loketNumber: loketNumber || 'Loket 1'
      }
    });

    broadcastQueueUpdate(updated.polyclinic);
    res.json({ success: true, queue: updated });
  } catch (error) {
    console.error('[QUEUE] Error calling patient:', error);
    res.status(500).json({ success: false, error: 'Kesalahan internal server.' });
  }
});

// POST /api/queue/complete/:id - selesaikan pasien
router.post('/complete/:id', requireAuth, requireRole('Master', 'SuperUser', 'User'), async (req, res) => {
  try {
    const updated = await prisma.queueLog.update({
      where: { id: req.params.id },
      data: { status: 'completed', completedAt: new Date() }
    });

    broadcastQueueUpdate(updated.polyclinic);
    res.json({ success: true, queue: updated });
  } catch (error) {
    console.error('[QUEUE] Error completing:', error);
    res.status(500).json({ success: false, error: 'Kesalahan internal server.' });
  }
});

// POST /api/queue/skip/:id - skip/tahan pasien
router.post('/skip/:id', requireAuth, requireRole('Master', 'SuperUser', 'User'), async (req, res) => {
  try {
    const updated = await prisma.queueLog.update({
      where: { id: req.params.id },
      data: { status: 'skipped' }
    });

    broadcastQueueUpdate(updated.polyclinic);
    res.json({ success: true, queue: updated });
  } catch (error) {
    console.error('[QUEUE] Error skipping:', error);
    res.status(500).json({ success: false, error: 'Kesalahan internal server.' });
  }
});

// GET /api/queue/display - SSE stream untuk TV display (publik, ter-redaksi)
router.get('/display', async (req, res) => {
  const { poli } = req.query;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const clientId = `${Date.now()}-${Math.random()}`;
  sseClients.set(clientId, { res, poli });

  const queues = await prisma.queueLog.findMany({
    where: {
      polyclinic: poli || undefined,
      status: { in: ['waiting', 'called', 'serving'] }
    },
    orderBy: { createdAt: 'asc' }
  });

  res.write(`data: ${JSON.stringify({ type: 'init', queues: queues.map(publicQueue) })}\n\n`);

  req.on('close', () => {
    sseClients.delete(clientId);
  });
});

// GET /api/queue/logs - riwayat antrean (staff/admin saja)
router.get('/logs', requireAuth, requireRole('Master', 'SuperUser', 'User'), async (req, res) => {
  try {
    const { date, poli } = req.query;

    const where = {};
    if (poli) where.polyclinic = poli;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      where.createdAt = { gte: startDate, lt: endDate };
    }

    const logs = await prisma.queueLog.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, logs });
  } catch (error) {
    console.error('[QUEUE] Error fetching logs:', error);
    res.status(500).json({ success: false, error: 'Kesalahan internal server.' });
  }
});

// Helper: broadcast update ke SSE clients (redacted)
function broadcastQueueUpdate(poli) {
  sseClients.forEach(async (client) => {
    if (!client.poli || client.poli === poli) {
      const queues = await prisma.queueLog.findMany({
        where: {
          polyclinic: poli,
          status: { in: ['waiting', 'called', 'serving'] }
        },
        orderBy: { createdAt: 'asc' }
      });
      client.res.write(`data: ${JSON.stringify({ type: 'update', queues: queues.map(publicQueue) })}\n\n`);
    }
  });
}

module.exports = router;
