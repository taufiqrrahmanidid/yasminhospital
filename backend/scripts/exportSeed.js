// backend/scripts/exportSeed.js
// Export master data + konfigurasi + konten ke backend/seed/data.json
// Jalankan: docker compose exec backend node scripts/exportSeed.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const SEED_FILE = path.join(__dirname, '..', 'seed', 'data.json');

async function main() {
  const data = {
    hospitalInfo: await prisma.hospitalInfo.findMany(),
    polyclinics: await prisma.polyclinic.findMany({ orderBy: { code: 'asc' } }),
    specialists: await prisma.specialist.findMany({ orderBy: { code: 'asc' } }),
    specialistCategories: await prisma.specialistCategory.findMany({ orderBy: { name: 'asc' } }),
    doctors: await prisma.doctor.findMany({ orderBy: { id: 'asc' } }),
    rooms: await prisma.room.findMany({ orderBy: { id: 'asc' } }),
    socialMedia: await prisma.socialMedia.findMany(),
    announcements: await prisma.announcement.findMany(),
    insurancePartners: await prisma.insurancePartner.findMany({ orderBy: { name: 'asc' } }),
    bankAccounts: await prisma.bankAccount.findMany({ orderBy: { bankName: 'asc' } }),
    articles: await prisma.article.findMany({ orderBy: { createdAt: 'asc' } }),
  };

  fs.mkdirSync(path.dirname(SEED_FILE), { recursive: true });
  fs.writeFileSync(
    SEED_FILE,
    JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 2),
    'utf8'
  );

  const total = Object.values(data).reduce((s, a) => s + a.length, 0);
  console.log(`✅ Seed diexport: ${total} record → ${SEED_FILE}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
