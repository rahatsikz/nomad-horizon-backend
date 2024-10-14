/*
  Warnings:

  - The values [pending] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `slotAvailable` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('processing', 'confirmed', 'rejected', 'adjusted', 'completed', 'cancelled');
ALTER TABLE "bookings" ALTER COLUMN "bookingStatus" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "bookingStatus" TYPE "BookingStatus_new" USING ("bookingStatus"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "bookings" ALTER COLUMN "bookingStatus" SET DEFAULT 'processing';
COMMIT;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "slotAvailable",
ALTER COLUMN "bookingStatus" SET DEFAULT 'processing';
