/*
  Warnings:

  - The values [AVAILABLE,IN_OPERATION] on the enum `StatusVehicle` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusVehicle_new" AS ENUM ('ACTIVE', 'MAINTENANCE', 'DECOMMISSIONED');
ALTER TABLE "public"."Vehicle" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Vehicle" ALTER COLUMN "status" TYPE "StatusVehicle_new" USING ("status"::text::"StatusVehicle_new");
ALTER TYPE "StatusVehicle" RENAME TO "StatusVehicle_old";
ALTER TYPE "StatusVehicle_new" RENAME TO "StatusVehicle";
DROP TYPE "public"."StatusVehicle_old";
ALTER TABLE "Vehicle" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
