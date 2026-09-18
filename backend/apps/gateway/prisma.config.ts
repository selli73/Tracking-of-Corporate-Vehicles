import 'dotenv/config';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./apps/gateway/prisma/contract.prisma",
    migrations: {
      dir: "./apps/gateway/prisma/migrations"
    },
    db: {
      connection: process.env['GATEWAY_DATABASE_URL']!,
    },
  }),
});
