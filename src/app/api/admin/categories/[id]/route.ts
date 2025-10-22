import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!admin || admin.role !== Role.ADMIN) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const { name } = await req.json();
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return new NextResponse("Invalid name", { status: 400 });
    }
    const updated = await prisma.category.update({ where: { id: params.id }, data: { name: name.trim() } });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(`Error updating category ${params.id}:`, e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!admin || admin.role !== Role.ADMIN) return new NextResponse("Unauthorized", { status: 401 });
  try {
    await prisma.category.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error(`Error deleting category ${params.id}:`, e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
