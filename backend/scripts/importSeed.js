// backend/scripts/importSeed.js
// Import master data + konfigurasi + konten dari backend/seed/data.json (upsert).
// Jalankan: docker compose exec backend node scripts/importSeed.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const SEED_FILE = path.join(__dirname, '..', 'seed', 'data.json');

const MODELS = [
  { model: 'hospitalInfo', key: 'hospitalInfo', idField: 'id' },
  { model: 'polyclinic', key: 'polyclinics', idField: 'code' },
  { model: 'specialist', key: 'specialists', idField: 'code' },
  { model: 'specialistCategory', key: 'specialistCategories', idField: 'id' },
  { model: 'doctor', key: 'doctors', idField: 'id' },
  { model: 'room', key: 'rooms', idField: 'id' },
  { model: 'socialMedia', key: 'socialMedia', idField: 'id' },
  { model: 'announcement', key: 'announcements', idField: 'id' },
  { model: 'insurancePartner', key: 'insurancePartners', idField: 'id' },
  { model: 'bankAccount', key: 'bankAccounts', idField: 'id' },
  { model: 'article', key: 'articles', idField: 'id' },
];

async function main() {
  if (!fs.existsSync(SEED_FILE)) {
    console.error('Seed file tidak ditemukan:', SEED_FILE);
    console.error('Jalankan dulu: node scripts/exportSeed.js');
    process.exit(1);
  }

  const { data } = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
  let total = 0;

  for (const { model, key, idField } of MODELS) {
    const items = data[key] || [];
    for (const item of items) {
      const id = item[idField];
      if (!id) continue;
      const { [idField]: _omit, ...rest } = item;
      await prisma[model].upsert({
        where: { [idField]: id },
        update: rest,
        create: { [idField]: id, ...rest },
      });
      total++;
    }
  }

  console.log(`✅ Seed diimport: ${total} record.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
