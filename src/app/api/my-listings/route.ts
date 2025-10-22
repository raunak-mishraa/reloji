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
    const listings = await prisma.listing.findMany({
      where: {
        ownerId: session.user.id,
        deletedAt: null, // Exclude soft-deleted listings
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true, // Include images to display on the card
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching user's listings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
