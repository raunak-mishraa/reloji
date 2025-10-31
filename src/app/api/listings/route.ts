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
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
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
      { category: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  // If `location` is provided, we'll filter by location text in application layer

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
    // Over-fetch to allow in-app filtering by location while keeping pagination roughly consistent
    const take = Math.max(limit, 10);
    const fetchCount = take * 3;
    const raw = await prisma.listing.findMany({
      take: fetchCount,
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

    // Application-layer location text filter on JSON field
    const locationQuery = location || null;
    let filtered = raw;
    if (latitude && longitude && distance) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const dist = parseFloat(distance);

      filtered = raw.filter((l: any) => {
        const loc = l.location || {};
        const listingLat = loc.latitude;
        const listingLon = loc.longitude;

        if (listingLat && listingLon) {
          const R = 6371; // Radius of the earth in km
          const dLat = (listingLat - lat) * (Math.PI / 180);
          const dLon = (listingLon - lon) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat * (Math.PI / 180)) *
              Math.cos(listingLat * (Math.PI / 180)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const d = R * c; // Distance in km
          return d <= dist;
        }
        return false;
      });
    } else if (locationQuery) {
      const q = locationQuery.toString().toLowerCase();
      filtered = raw.filter((l: any) => {
        const loc = l.location || {};
        const city = (loc.city || "").toString().toLowerCase();
        const state = (loc.state || "").toString().toLowerCase();
        const country = (loc.country || "").toString().toLowerCase();
        const address = (loc.address || "").toString().toLowerCase();
        return city.includes(q) || state.includes(q) || country.includes(q) || address.includes(q);
      });
    }

    const listings = filtered.slice(0, limit);
    let nextCursor = null as string | null;
    if (filtered.length > limit) {
      nextCursor = filtered[limit - 1]?.id ?? null;
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
      circleId,
      // Add other fields from your form here
    } = body;

    // Basic validation
    if (!title || !description || !categoryId || !pricePerDay || !depositAmount || !location) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const slug = `${slugBase}-${Date.now()}`;

    if (circleId) {
      const membership = await prisma.circleMember.findUnique({
        where: {
          circleId_userId: {
            circleId: circleId,
            userId: session.user.id,
          },
        },
      });
      if (!membership) {
        return new NextResponse("You are not a member of this circle.", { status: 403 });
      }
    }

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
        circleId: circleId || undefined,
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
