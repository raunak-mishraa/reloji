import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const { bookingId, toUserId, rating, comment } = await req.json();
    if (!bookingId || !toUserId || !rating) {
      return new NextResponse('Missing fields', { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return new NextResponse('Rating must be between 1 and 5', { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    });
    if (!booking) return new NextResponse('Booking not found', { status: 404 });

    // Ensure booking is completed and the reviewer participated in it
    const isParty = booking.borrowerId === session.user.id || booking.listing.ownerId === session.user.id;
    if (!isParty) return new NextResponse('Forbidden', { status: 403 });
    if (booking.status !== 'COMPLETED' && booking.status !== 'RETURNED') {
      return new NextResponse('Booking not completed', { status: 400 });
    }

    const fromUserId = session.user.id;

    // Prevent duplicate review from same -> to for this booking
    const existing = await prisma.userReview.findUnique({
      where: { bookingId_fromUserId_toUserId: { bookingId, fromUserId, toUserId } },
    });
    if (existing) return new NextResponse('Already reviewed', { status: 409 });

    await prisma.$transaction(async (tx) => {
      await tx.userReview.create({
        data: { bookingId, fromUserId, toUserId, rating, comment },
      });

      // Update recipient's profile rating as average of received reviews
      const agg = await tx.userReview.aggregate({
        where: { toUserId },
        _avg: { rating: true },
      });

      // Ensure profile exists
      const profile = await tx.profile.upsert({
        where: { userId: toUserId },
        create: { userId: toUserId, rating: agg._avg.rating || 0 },
        update: { rating: agg._avg.rating || 0 },
      });
    });

    return new NextResponse(null, { status: 201 });
  } catch (e) {
    console.error('POST /api/reviews/user error', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
