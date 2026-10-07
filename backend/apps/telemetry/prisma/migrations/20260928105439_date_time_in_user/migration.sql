/*
  Warnings:

  - Added the required column `driverLicenseExpiresAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "driverLicenseExpiresAt",
ADD COLUMN     "driverLicenseExpiresAt" TIMESTAMP(3) NOT NULL;
