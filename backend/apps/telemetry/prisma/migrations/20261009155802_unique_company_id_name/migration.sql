/*
  Warnings:

  - A unique constraint covering the columns `[companyId,name]` on the table `Geofence` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Geofence_companyId_key";

-- DropIndex
DROP INDEX "Geofence_companyId_name_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Geofence_companyId_name_key" ON "Geofence"("companyId", "name");
