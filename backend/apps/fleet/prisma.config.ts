import 'dotenv/config';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./apps/fleet/prisma/contract.prisma",
    migrations: {
      dir: './apps/fleet/prisma/migrations'
    },
    db: {
      connection: process.env['FLEET_DATABASE_URL']!,
    },
  }),
});
