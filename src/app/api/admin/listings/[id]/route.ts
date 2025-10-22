import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from '@prisma/client';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user?.role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { status } = await req.json();
    if (!status || !Object.values(ListingStatus).includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error(`Error updating listing ${params.id}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
