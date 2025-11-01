import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!admin || admin.role !== Role.ADMIN) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { role } = await req.json();
    if (!role || !Object.values(Role).includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    // Optional: prevent changing own role
    if (id === session.user.id) {
      return new NextResponse("Cannot change your own role", { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(`Error updating user ${id} role:`, e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
