import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { ItemCondition } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const categoryId = searchParams.get("categoryId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const condition = searchParams.get("condition") as ItemCondition;
  const minRating = searchParams.get("minRating");
  const location = searchParams.get("location");
  const distance = searchParams.get("distance");
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10");

  const where: any = {
    status: { in: ["APPROVED", "ACTIVE"] },
    deletedAt: null,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (location) {
    if (!where.OR) {
      where.OR = [];
    }
    where.OR.push({ location: { contains: location, mode: 'insensitive' } });
  }

  if (minPrice || maxPrice) {
    where.pricePerDay = {};
    if (minPrice) where.pricePerDay.gte = Number(minPrice);
    if (maxPrice) where.pricePerDay.lte = Number(maxPrice);
  }

  if (condition && Object.values(ItemCondition).includes(condition)) {
    where.condition = condition;
  }

  if (minRating) {
    where.rating = {
      gte: Number(minRating),
    };
  }

  // Filter out listings that have overlapping confirmed/active bookings for the requested date range
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    where.NOT = {
      bookings: {
        some: {
          status: { in: ["CONFIRMED", "ACTIVE"] },
          OR: [
            { startDate: { lte: end }, endDate: { gte: start } },
          ],
        },
      },
    };
  }

  try {
    const listings = await prisma.listing.findMany({
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
        category: true,
        owner: {
          select: { name: true, image: true },
        },
      },
    });

    let nextCursor = null;
    if (listings.length === limit) {
      nextCursor = listings[limit - 1].id;
    }

    return NextResponse.json({ listings, nextCursor });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return new NextResponse("Internal ServerError", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      categoryId,
      pricePerDay,
      depositAmount,
      location,
      imageUrls,
      // Add other fields from your form here
    } = body;

    // Basic validation
    if (!title || !description || !categoryId || !pricePerDay || !depositAmount || !location) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const slug = `${slugBase}-${Date.now()}`;

    const listing = await prisma.listing.create({
      data: {
        ownerId: session.user.id,
        title,
        description,
        categoryId,
        pricePerDay,
        depositAmount,
        location,
        slug,
        // Default other fields or get them from the body
        availability: body.availability ?? {},
        pricePerHour: body.pricePerHour ?? null,
        rules: body.rules ?? null,
        maxBorrowDuration: body.maxBorrowDuration ?? null,
        cancellationPolicy: body.cancellationPolicy ?? null,
        condition: body.condition ?? undefined,
        images: imageUrls?.length
          ? {
              create: imageUrls.map((url: string) => ({ url })),
            }
          : undefined,
      },
      include: { images: true },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
