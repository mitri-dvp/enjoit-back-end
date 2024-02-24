import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import * as bcrypt from 'bcrypt';

async function main() {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE public."user" RESTART IDENTITY CASCADE;`,
  );
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: await bcrypt.hash('password', 10),
      role: 'ADMIN',
      nickName: '',
      firstName: '',
      lastName: '',
      gender: '',
      birthDate: new Date(Number()),
      phone: '',
      phonePrefix: '',
      birthCountry: '',
      birthState: '',
      birthCity: '',
      birthPostalCode: null,
    },
  });
  const user = await prisma.user.create({
    data: {
      email: 'john@gmail.com',
      password: await bcrypt.hash('password', 10),
      role: 'USER',
      nickName: 'jhondoe_',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      birthDate: new Date('1/1/2000'),
      phone: '5555555555',
      phonePrefix: '57',
      birthCountry: 'colombia',
      birthState: 'atlantico',
      birthCity: 'barranquilla',
      birthPostalCode: null,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
