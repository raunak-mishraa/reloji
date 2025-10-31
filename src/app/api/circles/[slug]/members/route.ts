import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST /api/circles/[slug]/members - Join a circle
export async function POST(
  req: Request,
  context: { params: { slug: string } }
) {
  const { slug } = context.params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const circle = await prisma.circle.findUnique({
      where: { slug },
    });

    if (!circle) {
      return new NextResponse("Circle not found", { status: 404 });
    }

    // For private circles, this is where an approval flow would be triggered.
    // For now, we'll just allow joining public circles.
    if (circle.privacy === 'PRIVATE') {
        return new NextResponse("This is a private circle. Request to join functionality is not yet implemented.", { status: 403 });
    }

    const newMember = await prisma.circleMember.create({
      data: {
        circleId: circle.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error(`Error joining circle ${slug}:`, error);
    if ((error as any).code === 'P2002') {
        return new NextResponse("You are already a member of this circle.", { status: 409 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/circles/[slug]/members - Leave a circle
export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const circle = await prisma.circle.findUnique({
      where: { slug: params.slug },
    });

    if (!circle) {
      return new NextResponse("Circle not found", { status: 404 });
    }

    if (circle.creatorId === session.user.id) {
      return new NextResponse("The creator cannot leave the circle.", { status: 403 });
    }

    await prisma.circleMember.delete({
      where: {
        circleId_userId: {
          circleId: circle.id,
          userId: session.user.id,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`Error in DELETE /api/circles/[slug]/members:`, { slug: params.slug, error });
    if (error.code === 'P2025') {
      return new NextResponse("You are not a member of this circle.", { status: 404 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
