import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';

import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';

import { ZodHttpException } from '@src/handler/exception';

import {
  UserCreateDto,
  FindByPhoneDto,
  UserUpdateDto,
} from '@src/users/dto/user.dto';

import { GuestDto, SocialDto, emailSchema } from '@src/auth/dto/auth.dto';
import { Role } from '@src/auth/models/roles.model';

import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { Provider } from 'prisma/zod/enums';
import axios, { AxiosError } from 'axios';

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

  async generateUser(): Promise<UserCreateDto> {
    // Entropy > 100 bit
    const randomString = () => crypto.randomBytes(16).toString('hex');

    const hashedPassword = await bcrypt.hash(randomString(), 10);

    return {
      role: Role.USER,
      email: randomString(),
      password: hashedPassword,
      nickName: randomString(),
      firstName: randomString(),
      lastName: randomString(),
      gender: randomString(),
      phone: randomString(),
      phonePrefix: randomString(),
      birthCountry: randomString(),
      birthState: randomString(),
      birthCity: randomString(),
      birthDate: new Date(Number()),
      birthPostalCode: null,
    };
  }

  async createGuestUser(payload: GuestDto) {
    const user = await this.prisma.user.findFirst({
      where: { deviceId: payload.deviceId },
    });

    if (user) return user;

    const newUser = await this.generateUser();

    const guestUser: Prisma.UserCreateInput = {
      ...newUser,
      deviceId: payload.deviceId,
      role: Role.GUEST,
      isComplete: false,
    };

    return this.prisma.user.create({ data: guestUser });
  }

  async createSocialUser(payload: SocialDto) {
    const getUserInfo = async () => {
      switch (payload.provider) {
        case Provider.GOOGLE: {
          try {
            const { data } = await axios.get(
              `https://oauth2.googleapis.com/tokeninfo?id_token=${payload.accessToken}`,
            );
            const { email, name } = data;
            return { email, name };
          } catch (err) {
            const error = err as AxiosError;
            if (error.response) {
              if (error.response.status === 400) {
                throw new ZodHttpException('BAD_REQUEST', [
                  {
                    code: 'invalid_token',
                    path: ['accessToken'],
                    message: 'Invalid token',
                  },
                ]);
              }
            }
            throw new ZodHttpException('BAD_REQUEST', [
              {
                code: 'custom',
                path: [],
                message: `${payload.provider} sign in error`,
              },
            ]);
          }
        }
        case Provider.FACEBOOK: {
          try {
            const { data } = await axios.get(
              `https://graph.facebook.com/me?access_token=${payload.accessToken}&fields=email,name`,
            );

            const { email, name } = data;
            return { email, name };
          } catch (err) {
            const error = err as AxiosError;
            console.error(error);
            if (error.response) {
              if (error.response.status === 400) {
                throw new ZodHttpException('BAD_REQUEST', [
                  {
                    code: 'invalid_token',
                    path: ['accessToken'],
                    message: 'Invalid token',
                  },
                ]);
              }
            }
            throw new ZodHttpException('BAD_REQUEST', [
              {
                code: 'custom',
                path: [],
                message: `${payload.provider} sign in error`,
              },
            ]);
          }
        }

        default: {
          throw new ZodHttpException('BAD_REQUEST', [
            {
              code: 'invalid_string',
              path: ['id'],
              message: `Provider ${payload.provider} not supported`,
              validation: 'regex',
            },
          ]);
        }
      }
    };

    const info = await getUserInfo();

    const user = await this.prisma.user.findFirst({
      where: { email: info.email },
    });

    if (user) return user;

    const newUser = await this.generateUser();

    const socialUser: Prisma.UserCreateInput = {
      ...newUser,
      role: Role.USER,
      isComplete: false,
      email: info.email,
      nickName: info.name,
      firstName: info.name,
    };

    return this.prisma.user.create({ data: socialUser });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      throw new ZodHttpException('NOT_FOUND', [
        {
          code: 'not_found',
          path: ['id'],
          message: 'User not found',
        },
      ]);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      throw new ZodHttpException('NOT_FOUND', [
        {
          code: 'not_found',
          path: ['email'],
          message: 'User not found',
        },
      ]);
    }

    return user;
  }

  async findByPhone(payload: FindByPhoneDto) {
    const user = await this.prisma.user.findFirst({
      where: { phonePrefix: payload.phonePrefix, phone: payload.phone },
    });

    if (!user) {
      throw new ZodHttpException('NOT_FOUND', [
        {
          code: 'not_found',
          path: ['phone', 'phonePrefix'],
          message: 'User not found',
        },
      ]);
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
      throw new ZodHttpException('NOT_FOUND', [
        {
          code: 'not_found',
          path: Object.keys(where || {}),
          message: 'User not found',
        },
      ]);
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
