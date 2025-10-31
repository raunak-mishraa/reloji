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
    const circle = await prisma.circle.findUnique({
      where: { slug },
      include: {
        creator: {
          select: { id: true, name: true, image: true },
        },
        _count: { select: { members: true, listings: true } },
      },
    });

    if (!circle) {
      return new NextResponse("Circle not found", { status: 404 });
    }

    const session = await getServerSession(authOptions);
    let isMember = false;
    if (session?.user?.id) {
      const membership = await prisma.circleMember.findUnique({
        where: {
          circleId_userId: {
            circleId: circle.id,
            userId: session.user.id,
          },
        },
      });
      isMember = !!membership;
    }

    return NextResponse.json({ ...circle, isMember });
  } catch (error) {
    console.error(`Error fetching circle ${slug}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
