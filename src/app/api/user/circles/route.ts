import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/user/circles - Fetch circles the current user is a member of
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const memberships = await prisma.circleMember.findMany({
      where: { userId: session.user.id },
      include: {
        circle: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        circle: {
          name: 'asc',
        },
      },
    });

    const circles = memberships.map(m => m.circle);

    return NextResponse.json(circles);
  } catch (error) {
    console.error("Error fetching user's circles:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
