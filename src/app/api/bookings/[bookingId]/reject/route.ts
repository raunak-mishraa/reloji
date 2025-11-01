import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Verify the booking exists and belongs to one of the user's listings
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        listing: {
          ownerId: session.user.id,
        },
      },
    });

    if (!booking) {
      return new NextResponse("Booking not found or you do not have permission to modify it.", { status: 404 });
    }

    // Check if the booking is in a state that can be rejected (e.g., PENDING)
    if (booking.status !== 'PENDING') {
      return new NextResponse(`Booking is already in ${booking.status} state.`, { status: 400 });
    }

    // Update the booking status to REJECTED
    const updatedBooking = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'REJECTED' },
        include: { listing: true },
      });

      await tx.notification.create({
        data: {
          userId: booking.borrowerId,
          message: `Your booking for "${booking.listing.title}" has been rejected.`,
        },
      });

      await pusherServer.trigger(booking.borrowerId, 'notifications:new', {});

      return booking;
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error rejecting booking:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
