import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { listingId, startDate, endDate } = body;

    if (!listingId || !startDate || !endDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return new NextResponse("Cannot book for a past date", { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    if (listing.ownerId === session.user.id) {
      return new NextResponse("You cannot book your own listing", { status: 403 });
    }

    const existingBookingByUser = await prisma.booking.findFirst({
      where: {
        listingId: listingId,
        borrowerId: session.user.id,
        status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
      },
    });

    if (existingBookingByUser) {
      return new NextResponse("You have already requested to book this item", { status: 409 });
    }

    // --- Availability Check ---
    const existingBooking = await prisma.booking.findFirst({
      where: {
        listingId: listingId,
        status: { in: ["CONFIRMED", "ACTIVE"] },
        OR: [
          { startDate: { lte: new Date(endDate), gte: new Date(startDate) } },
          { endDate: { lte: new Date(endDate), gte: new Date(startDate) } },
        ],
      },
    });

    if (existingBooking) {
      return new NextResponse("Dates not available", { status: 409 });
    }

    // --- Price Calculation ---
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * listing.pricePerDay;

    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          listingId,
          borrowerId: session.user.id,
          startDate: start,
          endDate: end,
          totalAmount: totalPrice,
          depositHeld: listing.depositAmount,
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
        },
      });

      await tx.conversation.create({
        data: {
          bookingId: newBooking.id,
          participants: {
            connect: [{ id: session.user.id }, { id: listing.ownerId }],
          },
        },
      });

      return newBooking;
    });

    // In a real app, you'd now initiate the Stripe payment flow.

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
