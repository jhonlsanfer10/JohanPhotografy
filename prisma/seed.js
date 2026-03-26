const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })
  console.log('Admin user created:', admin.email)

  // Seed some initial content keys
  const defaultText = [
    { key: 'hero_title', value: 'Capturando los Mejores Momentos' },
    { key: 'hero_subtitle', value: 'Fotografía Profesional' },
    { key: 'about_text', value: 'Soy un fotógrafo profesional apasionado por capturar la esencia de cada momento.' }
  ]

  for (const text of defaultText) {
    await prisma.content.upsert({
      where: { key: text.key },
      update: {},
      create: text,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
