/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `Geofence` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Geofence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Geofence" ADD COLUMN     "companyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Geofence_companyId_key" ON "Geofence"("companyId");

-- CreateIndex
CREATE INDEX "Geofence_companyId_idx" ON "Geofence"("companyId");
