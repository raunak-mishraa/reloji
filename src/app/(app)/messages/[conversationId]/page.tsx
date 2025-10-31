'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/lib/pusher';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#0f8c27]" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-8">
        <Card className="max-w-md mx-auto p-6 border-destructive/50 bg-destructive/5">
          <p className="text-destructive text-center">Error loading conversation</p>
        </Card>
      </div>
    );
  }

  // Find the other participant (not the current user)
  const otherParticipant = conversation.participants?.find((p: any) => p.id !== session?.user?.id);
  const participantName = otherParticipant?.name || 'Unknown User';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[#0f8c27]/5">
      <div className="container mx-auto px-4 md:px-8 py-4 md:py-6">
        {/* Header */}
        <Card className="mb-4">
          <div className="p-4 flex items-center gap-3">
            <Link href="/messages">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherParticipant?.image} />
              <AvatarFallback className="bg-[#0f8c27]/10 text-[#0f8c27] font-semibold">
                {participantName[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-base">{participantName}</h2>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </Card>

        {/* Messages Container */}
        <Card className="h-[calc(100vh-16rem)] md:h-[calc(100vh-14rem)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Start the conversation!</p>
                </div>
              </div>
            ) : (
              conversation.messages.map((msg: any, index: number) => {
                const isOwn = msg.senderId === session?.user?.id;
                const showAvatar = !isOwn && (index === 0 || conversation.messages[index - 1].senderId !== msg.senderId);
                
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isOwn ? 'justify-end' : ''}`}>
                    {!isOwn && (
                      <Avatar className={`h-8 w-8 ${showAvatar ? '' : 'invisible'}`}>
                        <AvatarImage src={msg?.sender?.image ?? '/default-avatar.png'} />
                        <AvatarFallback className="bg-[#0f8c27]/10 text-[#0f8c27] text-xs font-semibold">
                          {msg?.sender?.name?.charAt(0).toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[75%] sm:max-w-md p-3 rounded-2xl shadow-sm ${
                      isOwn 
                        ? 'bg-[#0f8c27] text-white rounded-br-sm' 
                        : 'bg-muted rounded-bl-sm'
                    }`}>
                      <p className="text-sm break-words">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        isOwn ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Type a message..." 
                className="flex-1"
                disabled={mutation.isPending}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={mutation.isPending || !content.trim()}
                className="bg-[#0f8c27] hover:bg-[#0da024] h-10 w-10 flex-shrink-0"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
