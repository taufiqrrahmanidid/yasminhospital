// backend/simrs/masterSync.js
// ============================================================
// Tarik master data dari SIMRS (Trust Medis) → upsert ke DB lokal.
// Production-ready: idempotent (upsert), toleran error per-entitas,
// logging jelas, timeout, dan field-mapping fleksibel.
//
// PENTING: path & nama field di bawah bersifat GENERIC. Setelah
// menerima API spec resmi Trust Medis, cukup sesuaikan konstanta
// ENDPOINTS dan mapping field `pick(...)` — logika tidak perlu diubah.
// ============================================================
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TIMEOUT_MS = 8000;

// ===== KONFIGURASI ENDPOINT (SESUAIKAN DENGAN API SPEC RESMI) =====
const ENDPOINTS = {
  polyclinics: '/master/poli',      // TODO: path resmi tarik data poli
  specialists: '/master/spesialis', // TODO: path resmi tarik data spesialis
  doctors: '/master/dokter',        // TODO: path resmi tarik data dokter
  rooms: '/master/kamar',           // TODO: path resmi tarik data kamar
};

function baseUrl() { return process.env.SIMRS_BASE_URL; }
function apiKey() { return process.env.SIMRS_API_KEY; }

async function simrsFetch(path) {
  const raw = String(baseUrl() || '').trim();
  if (!raw || !/^https?:\/\//i.test(raw)) {
    throw new Error('SIMRS belum dikonfigurasi (SIMRS_BASE_URL kosong atau tidak valid).');
  }
  const base = raw.replace(/\/$/, '');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${base}${path}`, {
      method: 'GET',
      headers: { 'X-API-KEY': apiKey() || '', 'Accept': 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} (${path})`);
    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// Mendukung response berbentuk array langsung, {data:[...]}, atau {items:[...]}
function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
}

// Ambil nilai dari beberapa kemungkinan nama field (fleksibel terhadap variasi API)
function pick(obj, keys, fallback = null) {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
}

async function syncPolyclinics() {
  const items = toArray(await simrsFetch(ENDPOINTS.polyclinics));
  let count = 0;
  for (const item of items) {
    const code = String(pick(item, ['code', 'kodePoli', 'kode', 'id'], '')).trim();
    const name = String(pick(item, ['name', 'namaPoli', 'nama', 'polyclinicName'], '')).trim();
    if (!code || !name) continue;
    const status = String(pick(item, ['status', 'active'], 'Aktif'));
    const price = Number(pick(item, ['price', 'biaya', 'tarif'], 135000));
    await prisma.polyclinic.upsert({
      where: { code },
      update: { name, status, price },
      create: { code, name, status, price },
    });
    count++;
  }
  return { entity: 'polyclinics', count };
}

async function syncSpecialists() {
  const items = toArray(await simrsFetch(ENDPOINTS.specialists));
  let count = 0;
  for (const item of items) {
    const code = String(pick(item, ['code', 'kodeSpesialis', 'kode', 'id'], '')).trim();
    const name = String(pick(item, ['name', 'namaSpesialis', 'nama', 'specialistName'], '')).trim();
    if (!code || !name) continue;
    const description = String(pick(item, ['description', 'deskripsi', 'desc'], ''));
    await prisma.specialist.upsert({
      where: { code },
      update: { name, description },
      create: { code, name, description },
    });
    count++;
  }
  return { entity: 'specialists', count };
}

async function syncDoctors() {
  const items = toArray(await simrsFetch(ENDPOINTS.doctors));
  let count = 0;
  for (const item of items) {
    const id = String(pick(item, ['id', 'kodeDokter', 'doctorId', 'nip'], '')).trim();
    const name = String(pick(item, ['name', 'namaDokter', 'nama', 'doctorName'], '')).trim();
    if (!id || !name) continue;
    const specialty = String(pick(item, ['specialty', 'spesialisasi', 'specialistName'], ''));
    const subSpecialty = String(pick(item, ['subSpecialty', 'poli', 'polyclinicName'], ''));
    const status = String(pick(item, ['status', 'active'], 'Aktif'));
    const gender = String(pick(item, ['gender', 'jenisKelamin'], ''));
    const licenseNumber = String(pick(item, ['licenseNumber', 'str', 'noSTR'], ''));
    const schedule = pick(item, ['schedule', 'jadwal', 'jadwalPraktek'], null);
    await prisma.doctor.upsert({
      where: { id },
      update: { name, specialty, subSpecialty, status, gender, licenseNumber, schedule },
      create: { id, name, specialty, subSpecialty, status, gender, licenseNumber, schedule },
    });
    count++;
  }
  return { entity: 'doctors', count };
}

async function syncRooms() {
  const items = toArray(await simrsFetch(ENDPOINTS.rooms));
  let count = 0;
  for (const item of items) {
    const id = String(pick(item, ['id', 'kodeKamar', 'kode', 'roomId'], '')).trim();
    const name = String(pick(item, ['name', 'namaKamar', 'nama', 'roomName'], '')).trim();
    if (!id || !name) continue;
    const type = String(pick(item, ['type', 'tipe', 'jenis'], ''));
    const cls = String(pick(item, ['class', 'kelas', 'classRoom'], ''));
    const capacity = Number(pick(item, ['capacity', 'kapasitas'], 0));
    const occupied = Number(pick(item, ['occupied', 'terisi'], 0));
    const facilities = String(pick(item, ['facilities', 'fasilitas'], ''));
    await prisma.room.upsert({
      where: { id },
      update: { type, name, class: cls, capacity, occupied, facilities },
      create: { id, type, name, class: cls, capacity, occupied, facilities },
    });
    count++;
  }
  return { entity: 'rooms', count };
}

// Jalankan semua sinkronisasi; satu entitas gagal tidak menghentikan yang lain.
async function syncAllMasterData() {
  const tasks = [
    { name: 'polyclinics', fn: syncPolyclinics },
    { name: 'specialists', fn: syncSpecialists },
    { name: 'doctors', fn: syncDoctors },
    { name: 'rooms', fn: syncRooms },
  ];
  const results = [];
  const errors = [];
  for (const { name, fn } of tasks) {
    try {
      const r = await fn();
      console.log(`[SIMRS MASTER] ${name}: ${r.count} record tersinkron.`);
      results.push(r);
    } catch (e) {
      console.error(`[SIMRS MASTER] ${name} GAGAL:`, e.message);
      errors.push({ entity: name, error: e.message });
    }
  }
  return { results, errors };
}

module.exports = { syncAllMasterData, syncPolyclinics, syncSpecialists, syncDoctors, syncRooms };
