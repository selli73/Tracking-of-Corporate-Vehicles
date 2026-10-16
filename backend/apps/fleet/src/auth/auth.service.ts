import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ERROR_CODES, LoginDto, LoginResponse } from '@app/contracts';
import { RpcException } from '@nestjs/microservices';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private _prismaService: PrismaService) {}

  async login(data: LoginDto): Promise<LoginResponse> {
    const user = await this._prismaService.user.findUnique({
      where: {
        email: data.email
      },
    });

    if (!user) {
      throw new RpcException({
        code: ERROR_CODES.INCORRECT_USERNAME_OR_PASSWORD,
        message: 'Неправильный логин или пароль'
      });
    }

    const passwordHash = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordHash) {
      throw new RpcException({
        code: ERROR_CODES.INCORRECT_USERNAME_OR_PASSWORD,
        message: 'Неправильный логин или пароль'
      });
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };
  }
}
