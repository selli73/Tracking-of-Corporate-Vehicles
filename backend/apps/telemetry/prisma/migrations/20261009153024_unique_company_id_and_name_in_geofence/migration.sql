-- DropIndex
DROP INDEX "Geofence_companyId_idx";

-- CreateIndex
CREATE INDEX "Geofence_companyId_name_idx" ON "Geofence"("companyId", "name");
