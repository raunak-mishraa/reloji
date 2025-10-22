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
    const listings = await prisma.listing.findMany({
      where: {
        ownerId: session.user.id,
      },
      include: {
        images: true,
        bookings: {
          select: { id: true, status: true },
        },
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
