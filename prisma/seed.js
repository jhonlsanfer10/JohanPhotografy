const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@photografy.studio' },
    update: {},
    create: {
      email: 'admin@photografy.studio',
      name: 'Admin',
      password: hashedPassword,
    },
  });
  
  console.log('✅ Admin creado:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
