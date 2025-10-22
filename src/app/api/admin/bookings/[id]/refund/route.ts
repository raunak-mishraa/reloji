import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { Role } from "@prisma/client";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!admin || admin.role !== Role.ADMIN) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const { amount, reason } = body as { amount?: number; reason?: string };

    const booking = await prisma.booking.findUnique({ where: { id: params.id }, include: { listing: true } });
    if (!booking) return new NextResponse("Booking not found", { status: 404 });

    const key_id = process.env.RAZORPAY_KEY_ID as string;
    const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
    if (!key_id || !key_secret) return new NextResponse("Razorpay keys not configured", { status: 500 });

    const rzp = new Razorpay({ key_id, key_secret });

    // Determine payment id: we store payment id on verify, but legacy rows may have order id
    let paymentId = booking.razorpayPaymentId || undefined;
    if (!paymentId) return new NextResponse("No payment associated with booking", { status: 400 });

    if (paymentId.startsWith("order_")) {
      const payments = await rzp.orders.fetchPayments(paymentId as any);
      // @ts-ignore types for sdk response
      const firstPayment = payments.items?.[0];
      if (!firstPayment?.id) return new NextResponse("No payments found for order", { status: 400 });
      paymentId = firstPayment.id as string;
    }

    if (!paymentId.startsWith("pay_")) {
      return new NextResponse("Invalid payment identifier", { status: 400 });
    }

    // Default refund amount = totalAmount + depositHeld (full refund)
    const fallbackAmount = Math.round((booking.totalAmount + booking.depositHeld) * 100);
    const amountPaise = Math.round((amount ?? (fallbackAmount / 100)) * 100);
    if (amountPaise <= 0) return new NextResponse("Refund amount must be positive", { status: 400 });

    // Create refund
    const refund = await rzp.payments.refund(paymentId as any, {
      amount: amountPaise,
      speed: "optimum",
      notes: {
        bookingId: booking.id,
        listingId: booking.listingId,
        reason: reason || "admin_refund",
      },
    } as any);

    return NextResponse.json({
      id: refund.id,
      status: refund.status,
      amount: refund.amount,
      currency: refund.currency,
      payment_id: paymentId,
    });
  } catch (e) {
    console.error(`Error refunding booking ${params.id}:`, e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
