import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { render } from '@react-email/render';
import { NewMessageEmail } from '@/emails/NewMessageEmail';
import { pusherServer } from '@/lib/pusher';

export async function GET(
  req: Request,
  { params: rawParams }: { params: { conversationId: string } }
) {
  const params = await rawParams;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: params.conversationId,
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        messages: {
          include: {
            sender: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error(`Error fetching conversation ${params.conversationId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: rawParams }: { params: { conversationId: string } }
) {
  const params = await rawParams;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { content } = await req.json();
    if (!content) {
      return new NextResponse('Missing content', { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        conversationId: params.conversationId,
        senderId: session.user.id,
        content,
      },
      include: {
        sender: true,
        conversation: {
          include: {
            participants: true,
          },
        },
      },
    });

    const recipient = newMessage.conversation.participants.find(p => p.id !== session.user.id);
    if (recipient && recipient.email) {
      const emailHtml = render(NewMessageEmail({ 
        senderName: newMessage.sender.name || 'A user',
        messageContent: newMessage.content,
        conversationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/messages/${newMessage.conversationId}`
      }));

      await sendEmail({
        to: recipient.email,
        subject: `New message from ${newMessage.sender.name}`,
        html: emailHtml,
      });

      await pusherServer.trigger(newMessage.conversationId, 'messages:new', newMessage);

      await prisma.notification.create({
        data: {
          userId: recipient.id,
          message: `You have a new message from ${newMessage.sender.name}`,
        },
      });

      await pusherServer.trigger(recipient.id, 'notifications:new', {});
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error(`Error sending message to conversation ${params.conversationId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}