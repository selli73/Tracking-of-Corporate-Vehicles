import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyResponseCreate, ERROR_CODES, RegisterCompanyDto, role } from '@app/contracts';
import bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CompanyService {
    constructor(private _prismaService: PrismaService) {}

    async register(data: RegisterCompanyDto): Promise<CompanyResponseCreate> {
        try {
            const passwordHash = await bcrypt.hash(data.owner.password, 10);

            const response = await this._prismaService.db.transaction( async (tx) => {
                const company = await tx.orm.public.Company.create({
                    officialName: data.company.officialName,
                    shortName: data.company.shortName,
                    tin: data.company.tin,
                    registeredAddress: data.company.registeredAddress,
                    actualAddress: data.company.actualAddress,
                    phone: data.company.phone,
                    email: data.company.companyEmail,

                });

                const user = await tx.orm.public.User.create({
                    email: data.owner.email,
                    passwordHash,
                    name: data.owner.name,
                    surname: data.owner.surname,
                    role: 'OWNER',
                    companyId: company.id
                });

                return {
                    company: { 
                        id: company.id,
                        officialName: company.officialName,
                        shortName: company.shortName                        
                    },
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        surname: user.surname,
                        role: user.role,
                        companyId: user.companyId
                    }
                }
            })

            return response;

            
        } catch(error: any) {
            if (typeof error === 'object' && error !== null && error.sqlState === '23505') {
                throw new RpcException({
                    code: ERROR_CODES.COMPANY_OR_OWNER_ALREADY_EXISTS,
                    message: 'A company or owner with these details exists'
                });
            }
            throw error;
        }
    }
}
