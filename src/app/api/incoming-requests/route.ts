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
        listing: {
          ownerId: session.user.id,
        },
        // Optionally, you might want to filter by status, e.g., only PENDING
        // status: 'PENDING',
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        listing: {
          select: {
            title: true,
            images: { take: 1, select: { url: true } }, // Get only the first image
          },
        },
        borrower: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching incoming requests:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
