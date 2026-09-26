import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from '@app/contracts';
import { RpcException } from '@nestjs/microservices';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private _prismaService: PrismaService) {}

    async login(data: LoginDto) {
        const user = await this._prismaService.db.orm.public.User.first({
            email: data.email
        });

        if (!user) {
            throw new RpcException('Incorrect username or password');
        }

        const passwordHash = await bcrypt.compare(data.password, user.passwordHash);

        if (!passwordHash) {
            throw new RpcException('Incorrect username or password');
        }

        return {
            
        }
    }
}
