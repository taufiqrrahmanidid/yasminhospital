const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_MASTER_EMAIL;
  const password = process.env.SEED_MASTER_PASSWORD;

  if (!email || !password) {
    console.error('Wajib set SEED_MASTER_EMAIL & SEED_MASTER_PASSWORD.');
    process.exit(1);
  }
  if (password.length < 16) {
    console.error('Password master minimal 16 karakter.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash: hash, role: 'Master', permissions: ['ALL_ACCESS'] },
    create: { email, name: 'Master', passwordHash: hash, role: 'Master', permissions: ['ALL_ACCESS'] },
  });
  console.log('✅ Akun Master berhasil di-seed.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
