import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Contract } from '../../prisma/contract.d';
import contractJson from '../../prisma/contract.json' with { type: 'json' };
import postgres from '@prisma/orm-postgres/runtime';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  public readonly db;

  constructor(private readonly config: ConfigService) {
    this.db = postgres<Contract>({
      contractJson,
      url: this.config.getOrThrow<string>('GATEWAY_DATABASE_URL'),
    });
  }

  async onModuleDestroy() {
    if ('$disconnect' in this.db && typeof this.db.$disconnect === 'function') {
      await this.db.$disconnect();
    }
  }
}