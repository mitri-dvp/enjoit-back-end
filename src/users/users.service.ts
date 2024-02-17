import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@src/prisma/prisma.service';

import {
  UserCreateDto,
  FindByPhoneDto,
  UserUpdateDto,
} from '@src/users/dto/user.dto';
import { ZodHttpException } from '@src/handler/exception';
import { Prisma } from '@prisma/client';
import { emailSchema } from '@src/auth/dto/auth.dto';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: UserCreateDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (user) {
      throw new ZodHttpException('BAD_REQUEST', [
        {
          code: 'unique_constraint',
          path: ['email'],
          message: 'Unique constraint failed on the field',
        },
      ]);
    }

    const hashPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashPassword;

    return this.prisma.user.create({ data: payload });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      throw new NotFoundException(`User #${id} not found.`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException(`User email "${email}" not found`);
    }

    return user;
  }

  async findByPhone(payload: FindByPhoneDto) {
    const user = await this.prisma.user.findFirst({
      where: { phonePrefix: payload.phonePrefix, phone: payload.phone },
    });

    if (!user) {
      throw new NotFoundException(
        `User phone "+${payload.phonePrefix} ${payload.phone}" not found`,
      );
    }

    return user;
  }

  async findByIdentifier(identifier: string) {
    const isEmail = isNaN(Number(identifier));
    const isPhone = !isEmail;

    if (isEmail) {
      if (!emailSchema.safeParse(identifier).success) {
        throw new ZodHttpException('BAD_REQUEST', [
          {
            code: 'invalid_string',
            path: ['identifier'],
            message: 'Invalid email',
            validation: 'email',
          },
        ]);
      }

      return await this.findByEmail(identifier);
    }

    if (isPhone) {
      const phone = identifier.startsWith('+')
        ? identifier
        : `+57${identifier}`;

      if (!isValidPhoneNumber(phone)) {
        throw new ZodHttpException('BAD_REQUEST', [
          {
            code: 'invalid_string',
            path: ['identifier'],
            message: 'Invalid phone',
            validation: 'regex',
          },
        ]);
      }

      const { countryCallingCode, nationalNumber } = parsePhoneNumber(
        phone,
        'CO',
      );

      return await this.findByPhone({
        phone: nationalNumber,
        phonePrefix: countryCallingCode,
      });
    }

    throw new ZodHttpException('NOT_FOUND', [
      {
        code: 'not_found',
        path: ['identifier'],
        message: 'User not found',
      },
    ]);
  }

  async findOneBy(where: Prisma.UserWhereInput | undefined) {
    const user = await this.prisma.user.findFirst({
      where,
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async update(id: number, payload: UserUpdateDto) {
    const user = await this.findOne(id);

    if (payload.password) {
      const hashPassword = await bcrypt.hash(payload.password, 10);
      payload.password = hashPassword;
    }

    return await this.prisma.user.update({ where: { id: id }, data: payload });
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return await this.prisma.user.delete({ where: { id: id } });
  }
}
