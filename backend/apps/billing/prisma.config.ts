import 'dotenv/config';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./apps/billing/prisma/contract.prisma",
    migrations: { 
      dir: "./apps/billing/prisma/migrations"
     },
    db: {
      connection: process.env['BILLING_DATABASE_URL']!,
    },
  }),
});
