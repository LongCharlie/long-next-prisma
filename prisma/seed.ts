/**
 * Adds seed data to your db
 *
 * @see https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  await prisma.content.deleteMany({});
  await prisma.user.deleteMany({});

  const user1 = await prisma.user.upsert({
    where: { username: 'long' },
    update: {},
    create: {
      username: 'long',
      password: '15945116528',
      email: '3036403525@qq.com',
      role: 'admin'
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
