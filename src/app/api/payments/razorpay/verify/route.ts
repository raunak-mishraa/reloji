import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
    if (!key_secret) return new NextResponse("Razorpay key not configured", { status: 500 });

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // Update booking as confirmed and store the payment id
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error verifying razorpay payment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
