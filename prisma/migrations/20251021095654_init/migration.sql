-- CreateEnum
CREATE TYPE "ItemCondition" AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "condition" "ItemCondition" NOT NULL DEFAULT 'NEW';
