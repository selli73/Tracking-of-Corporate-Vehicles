import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client-booking';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private _configService: ConfigService) {
    const databaseUrl = _configService.getOrThrow('BOOKING_DATABASE_URL');
    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
