-- DropIndex
DROP INDEX "VehicleLocation_vehicleId_idx";

-- CreateIndex
CREATE INDEX "VehicleLocation_vehicleId_timestamp_idx" ON "VehicleLocation"("vehicleId", "timestamp");
