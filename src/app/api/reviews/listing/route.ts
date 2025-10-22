import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const { bookingId, rating, comment } = await req.json();
    if (!bookingId || !rating) {
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

    // Only borrower can review the listing after completion
    if (booking.borrowerId !== session.user.id) return new NextResponse('Forbidden', { status: 403 });
    if (booking.status !== 'COMPLETED' && booking.status !== 'RETURNED') {
      return new NextResponse('Booking not completed', { status: 400 });
    }

    // Prevent duplicate review for this booking
    const existing = await prisma.review.findUnique({ where: { bookingId: bookingId } });
    if (existing) return new NextResponse('Already reviewed', { status: 409 });

    await prisma.$transaction(async (tx) => {
      await tx.review.create({
        data: {
          bookingId,
          listingId: booking.listingId,
          rating,
          comment,
        },
      });

      // Update listing rating as average of reviews
      const agg = await tx.review.aggregate({
        where: { listingId: booking.listingId },
        _avg: { rating: true },
      });

      await tx.listing.update({
        where: { id: booking.listingId },
        data: { rating: agg._avg.rating || 0 },
      });
    });

    return new NextResponse(null, { status: 201 });
  } catch (e) {
    console.error('POST /api/reviews/listing error', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
