/*
  Warnings:

  - Added the required column `finishedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "finishedAt" TIMESTAMP(3) NOT NULL;
