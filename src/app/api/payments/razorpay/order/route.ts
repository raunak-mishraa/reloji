import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { bookingId } = await req.json();
    if (!bookingId) return new NextResponse("Missing bookingId", { status: 400 });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    });
    if (!booking) return new NextResponse("Booking not found", { status: 404 });
    if (booking.borrowerId !== session.user.id) return new NextResponse("Forbidden", { status: 403 });

    const key_id = process.env.RAZORPAY_KEY_ID as string;
    const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
    if (!key_id || !key_secret) return new NextResponse("Razorpay keys not configured", { status: 500 });

    const rzp = new Razorpay({ key_id, key_secret });

    // Amount in paise: totalAmount + depositHeld
    const amountPaise = Math.round((booking.totalAmount + booking.depositHeld) * 100);

    const razorpayOrder = await rzp.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `booking_${booking.id}`,
      notes: {
        listingId: booking.listingId,
        borrowerId: booking.borrowerId,
      },
    });

    // Store order id on booking 
    await prisma.booking.update({
      where: { id: booking.id },
      data: { razorpayPaymentId: razorpayOrder.id },
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: key_id,
      bookingId: booking.id,
      listingTitle: booking.listing.title,
    });
  } catch (error) {
    console.error("Error creating razorpay order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
