-- CreateTable
CREATE TABLE "Geofence" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "polygon" geometry(Polygon, 4326) NOT NULL,

    CONSTRAINT "Geofence_pkey" PRIMARY KEY ("id")
);
