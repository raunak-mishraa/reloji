import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        borrowerId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            images: { take: 1, select: { url: true } },
          },
        },
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching user's requests:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
