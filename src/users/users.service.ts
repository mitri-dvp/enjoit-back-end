import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (user) {
      throw new BadRequestException('User exists');
    }

    const hashPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashPassword;

    return this.prisma.user.create({
      data: {
        documentId: 123,
        documentType: 123,
        firstName: 'firstName',
        lastName: 'lastName',
        gender: 'gender',
        nickName: 'nickName',
        state: 123,
        email: payload.email,
        password: hashPassword,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException(`User email ${email} not found`);
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
