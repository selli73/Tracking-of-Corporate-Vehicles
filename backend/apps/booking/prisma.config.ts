import 'dotenv/config';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./apps/booking/prisma/contract.prisma",
    migrations: {
      dir: './apps/booking/prisma/migrations'
    },
    db: {
      connection: process.env['BOOKING_DATABASE_URL']!,
    },
  }),
});
