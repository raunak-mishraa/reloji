import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const listingSlug = searchParams.get("listingSlug");

  if (!listingSlug) {
    return new NextResponse("Missing listingSlug", { status: 400 });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { slug: listingSlug },
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        listingId: listing.id,
        borrowerId: session.user.id,
        status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
      },
    });

    return NextResponse.json({ hasBooking: !!existingBooking });
  } catch (error) {
    console.error("Error checking booking:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
