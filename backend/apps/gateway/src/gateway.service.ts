import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class GatewayService {
   
  constructor(private _prismaService: PrismaService) {}

  getHello() {
    return this._prismaService.db.orm.public.User.all();
  }
}
