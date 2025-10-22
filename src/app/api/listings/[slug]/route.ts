import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        slug: params.slug,
        deletedAt: null, // Ensure we don't fetch soft-deleted listings
      },
      include: {
        images: true,
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: { name: true, image: true },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
