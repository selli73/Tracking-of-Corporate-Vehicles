import 'dotenv/config';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./apps/telemetry/prisma/contract.prisma",
    migrations: {
      dir: './apps/telemetry/prisma/migrations'
    },
    db: {
      connection: process.env['TELEMETRY_DATABASE_URL']!,
    },
  }),
});
