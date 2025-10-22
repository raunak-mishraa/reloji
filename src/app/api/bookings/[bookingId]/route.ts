import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from '@prisma/client';

export async function PATCH(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { status } = await req.json();
    if (!status || !Object.values(BookingStatus).includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: { listing: true },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    // Only the listing owner can approve/decline
    if (booking.listing.ownerId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Logic to handle status changes (e.g., cannot approve a cancelled booking)
    if (booking.status !== 'PENDING') {
        return new NextResponse(`Cannot change status from ${booking.status}`, { status: 409 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.bookingId },
      data: { status },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error(`Error updating booking ${params.bookingId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
