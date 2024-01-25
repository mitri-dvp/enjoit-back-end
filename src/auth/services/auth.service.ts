import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { JwtPayload } from '../models/token.model';

import { SignupDto } from '../dto/auth.dto';

import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { Role } from '../models/roles.model';

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
    const payload: JwtPayload = { role: user.role, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async login(user: User) {
    const payload: JwtPayload = { role: user.role, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async signup(dto: SignupDto) {
    const newUser = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      role: Role.CUSTOMER,
    });

    const payload: JwtPayload = { role: newUser.role, sub: newUser.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: newUser,
    };
  }
}
