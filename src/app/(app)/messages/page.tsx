'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

async function getConversations() {
  const res = await fetch('/api/messages');
  if (!res.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return res.json();
}

export default function MessagesPage() {
  const { data: conversations, isLoading, error } = useQuery({ queryKey: ['conversations'], queryFn: getConversations });

  if (isLoading) return <div>Loading conversations...</div>;
  if (error) return <div>Error loading conversations</div>;

  return (
    <div className="container mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="space-y-4">
        {conversations.map((convo: any) => (
          <Link href={`/messages/${convo.id}`} key={convo.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted">
            <Avatar>
              <AvatarImage src={convo.participants?.[0]?.image} />
              <AvatarFallback>{convo.participants?.[0]?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold">{convo.participants?.[0]?.name || 'User'}</h3>
                {convo.messages?.[0]?.createdAt && (
                  <p className="text-xs text-muted-foreground">{new Date(convo.messages[0].createdAt).toLocaleTimeString()}</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{convo.messages?.[0]?.content || 'No messages yet'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
