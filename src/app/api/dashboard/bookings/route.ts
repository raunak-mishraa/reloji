import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        listing: {
          ownerId: session.user.id,
        },
      },
      include: {
        listing: {
          select: { title: true, images: { take: 1, select: { url: true } } },
        },
        borrower: {
          select: { name: true, image: true },
        },
        conversation: { select: { id: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
