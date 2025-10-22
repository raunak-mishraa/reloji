import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    const result = await prisma.booking.updateMany({
      where: {
        status: 'PENDING',
        expiresAt: {
          lt: now,
        },
      },
      data: {
        status: 'CANCELLED',
      },
    });

    return NextResponse.json({ success: true, expired: result.count });
  } catch (error) {
    console.error("Error expiring bookings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
