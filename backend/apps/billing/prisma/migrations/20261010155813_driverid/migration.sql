/*
  Warnings:

  - You are about to drop the column `userId` on the `Invoice` table. All the data in the column will be lost.
  - Added the required column `driverId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Invoice_userId_idx";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "userId",
ADD COLUMN     "driverId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Invoice_driverId_idx" ON "Invoice"("driverId");
