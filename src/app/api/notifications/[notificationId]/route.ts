import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: { notificationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await prisma.notification.update({
      where: {
        id: params.notificationId,
        userId: session.user.id,
      },
      data: {
        read: true,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error marking notification ${params.notificationId} as read:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
