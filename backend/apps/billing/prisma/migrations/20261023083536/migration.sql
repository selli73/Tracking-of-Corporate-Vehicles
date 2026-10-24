/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanceKm` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationMinutes` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kmRate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minuteRate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Invoice_bookingId_idx";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "updatedAt",
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "distanceKm" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "durationMinutes" INTEGER NOT NULL,
ADD COLUMN     "kmRate" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "minuteRate" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "vehicleId" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_bookingId_key" ON "Invoice"("bookingId");

-- CreateIndex
CREATE INDEX "Invoice_companyId_createdAt_idx" ON "Invoice"("companyId", "createdAt");
