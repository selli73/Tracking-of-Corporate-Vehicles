import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private _prismaService: PrismaService) {}
    
    async registerAdmin(data: RegisterUserDto) {
        
        const hashPassword = await bcrypt.hash(data.password, 10);
        
        const user = await this._prismaService.db.orm.public.User.create({
            email: data.email,
            passwordHash: hashPassword,
            name: data.name,
            surname: data.surname,
            role: 'COMPANY_ADMIN',
            companyId: data.companyId
        });

        const { passwordHash,...objectWithoutPassword  } = user;

        return objectWithoutPassword;
    }
}
