import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        slug: slug,
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

export async function DELETE(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    if (listing.ownerId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.listing.delete({
      where: {
        id: listing.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
