import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { BookingStatus, Role } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!admin || admin.role !== Role.ADMIN) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { status } = await req.json();
    if (!status || !(Object.values(BookingStatus) as string[]).includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(`Error updating booking ${id}:`, e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
