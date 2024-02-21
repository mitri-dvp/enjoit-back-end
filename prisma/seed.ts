import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import * as bcrypt from 'bcrypt';

async function main() {
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: await bcrypt.hash('password', 10),
      role: 'ADMIN',
      nickName: '',
      firstName: '',
      lastName: '',
      gender: '',
      birthDate: new Date(),
      phone: '',
      phonePrefix: '',
      birthCountry: '',
      birthState: '',
      birthCity: '',
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
