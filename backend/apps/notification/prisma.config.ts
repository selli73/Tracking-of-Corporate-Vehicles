import 'dotenv/config';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./apps/notification/prisma/contract.prisma",
    migrations: {
      dir: "./apps/notification/prisma/migrations"
    },
    db: {
      connection: process.env['NOTIFICATION_DATABASE_URL']!,
    },
  }),
});
