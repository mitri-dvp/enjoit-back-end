import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { JwtPayload } from '@src/auth/models/token.model';

import { SignupDto } from '@src/auth/dto/auth.dto';

import { Role } from '@src/auth/models/roles.model';

import { User } from '@prisma/client';
import { UsersService } from '@src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException('Invalid user');

    return user;
  }

  async generateJWT(user: User) {
    const payload: JwtPayload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async login(user: User) {
    const payload: JwtPayload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async signup(dto: SignupDto) {
    const newUser = await this.usersService.create({
      documentId: 123,
      documentType: 123,
      firstName: 'firstName',
      lastName: 'lastName',
      gender: 'gender',
      nickName: 'nickName',
      state: 123,
      email: dto.email,
      password: dto.password,
    });

    const payload: JwtPayload = { sub: newUser.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: newUser,
    };
  }
}
