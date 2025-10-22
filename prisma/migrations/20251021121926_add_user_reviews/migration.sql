-- CreateTable
CREATE TABLE "UserReview" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserReview_toUserId_idx" ON "UserReview"("toUserId");

-- CreateIndex
CREATE INDEX "UserReview_fromUserId_idx" ON "UserReview"("fromUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UserReview_bookingId_fromUserId_toUserId_key" ON "UserReview"("bookingId", "fromUserId", "toUserId");

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
