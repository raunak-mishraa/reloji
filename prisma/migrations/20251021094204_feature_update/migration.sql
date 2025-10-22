/*
  Warnings:

  - You are about to drop the column `stripePaymentIntentId` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[razorpayPaymentId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'APPROVED';

-- DropIndex
DROP INDEX "public"."Booking_stripePaymentIntentId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "stripePaymentIntentId",
ADD COLUMN     "razorpayPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_razorpayPaymentId_key" ON "Booking"("razorpayPaymentId");
