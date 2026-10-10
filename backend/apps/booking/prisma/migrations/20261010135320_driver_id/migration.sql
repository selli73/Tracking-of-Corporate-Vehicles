/*
  Warnings:

  - You are about to drop the column `userId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `driverId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recorderId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "userId",
ADD COLUMN     "driverId" TEXT NOT NULL,
ADD COLUMN     "recorderId" TEXT NOT NULL;
