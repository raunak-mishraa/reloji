import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

// GET /api/circles - List all public circles
export async function GET(req: Request) {
  try {
    const circles = await prisma.circle.findMany({ select: { id: true, name: true, slug: true, description: true, bannerImage: true, _count: { select: { members: true } } } ,
      where: { privacy: 'PUBLIC' },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(circles);
  } catch (error) {
    console.error("Error fetching circles:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/circles - Create a new circle
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, privacy, bannerImage } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const circleSlug = slugify(name, { lower: true, strict: true });

    const newCircle = await prisma.circle.create({
      data: {
        name,
        slug: circleSlug,
        description,
        privacy,
        bannerImage,
        creatorId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(newCircle, { status: 201 });
  } catch (error) {
    console.error("Error creating circle:", error);
    // Handle potential unique constraint violation for name/slug
    if ((error as any).code === 'P2002') {
      return new NextResponse("A circle with this name already exists.", { status: 409 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
