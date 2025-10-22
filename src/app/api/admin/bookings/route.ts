import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false as const };
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!user || user.role !== Role.ADMIN) return { ok: false as const };
  return { ok: true as const };
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        listing: { select: { id: true, title: true, ownerId: true } },
        borrower: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (e) {
    console.error("Error fetching bookings:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
