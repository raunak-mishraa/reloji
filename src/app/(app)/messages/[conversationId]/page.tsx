'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/lib/pusher';
import React, { useEffect } from 'react';

async function getConversation(id: string) {
  const res = await fetch(`/api/messages/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch conversation');
  }
  return res.json();
}

async function sendMessage({ conversationId, content }: { conversationId: string, content: string }) {
  const res = await fetch(`/api/messages/${conversationId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error('Failed to send message');
  }
  return res.json();
}

export default function ConversationPage() {
  const params = useParams();
  const { data: session } = useSession();
  const conversationId = params.conversationId as string;
  const queryClient = useQueryClient();

  const { data: conversation, isLoading, error } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversation(conversationId),
  });

  useEffect(() => {
    if (!conversationId) return;

    pusherClient.subscribe(conversationId);

    const messageHandler = (message: any) => {
      queryClient.setQueryData(['conversation', conversationId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          messages: [...oldData.messages, message],
        };
      });
    };

    pusherClient.bind('messages:new', messageHandler);

    return () => {
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unsubscribe(conversationId);
    };
  }, [conversationId, queryClient]);

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
    },
  });

  const [content, setContent] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutation.mutate({ conversationId, content });
    setContent('');
  };

  if (isLoading) return <div>Loading conversation...</div>;
  if (error) return <div>Error loading conversation</div>;

  return (
    <div className="container mx-auto px-8 py-8 h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-lg">
        {conversation.messages.map((msg: any) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === session?.user?.id ? 'justify-end' : ''}`}>
            {msg.senderId !== session?.user?.id && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={msg.sender.image} />
                <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div className={`max-w-xs p-3 rounded-lg ${msg.senderId === session?.user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type a message..." />
        <Button type="submit" size="icon" disabled={mutation.isPending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
