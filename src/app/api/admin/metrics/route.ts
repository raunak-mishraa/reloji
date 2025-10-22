import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { BookingStatus, ListingStatus, Role } from "@prisma/client";

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
    const [activeListings, totalUsers, bookingsByStatus, disputes] = await Promise.all([
      prisma.listing.count({ where: { status: ListingStatus.ACTIVE, deletedAt: null } }),
      prisma.user.count(),
      prisma.booking.groupBy({ by: ["status"], _count: true }),
      prisma.booking.count({ where: { status: BookingStatus.DISPUTE } }),
    ]);

    const bookings = Object.fromEntries(bookingsByStatus.map(b => [b.status, b._count]));

    return NextResponse.json({
      activeListings,
      totalUsers,
      bookings,
      disputes,
    });
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
