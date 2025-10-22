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
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(categories);
  } catch (e) {
    console.error("Error fetching admin categories:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const { name } = await req.json();
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return new NextResponse("Invalid name", { status: 400 });
    }
    const created = await prisma.category.create({ data: { name: name.trim() } });
    return NextResponse.json(created);
  } catch (e) {
    console.error("Error creating category:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
