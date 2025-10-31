import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params: { slug } }: { params: { slug: string } }
) {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        circle: {
          slug: slug,
        },
        deletedAt: null,
      },
      include: {
        images: true,
        category: true,
        owner: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error(`Error fetching listings for circle ${slug}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
