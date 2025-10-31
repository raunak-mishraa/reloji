'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageSquare, Clock } from 'lucide-react';

async function getConversations() {
  const res = await fetch('/api/messages');
  if (!res.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return res.json();
}

export default function MessagesPage() {
  const { data: conversations, isLoading, error } = useQuery({ queryKey: ['conversations'], queryFn: getConversations });
  
  // Filter out conversations with no messages
  const conversationsWithMessages = conversations?.filter((convo: any) => 
    convo.messages && convo.messages.length > 0
  ) || [];

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
          <p className="text-destructive text-center">Error loading conversations</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[#0f8c27]/5">
      <div className="container mx-auto py-6 md:py-10 px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">Your conversations</p>
        </div>

        {/* Empty State */}
        {conversationsWithMessages.length === 0 ? (
          <Card className="p-8 md:p-12 text-center border-dashed">
            <MessageSquare className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg md:text-xl font-semibold mb-2">No conversations yet</h3>
            <p className="text-sm md:text-base text-muted-foreground">Start browsing items to connect with others</p>
          </Card>
        ) : (
          /* Conversations List */
          <div className="space-y-3">
            {conversationsWithMessages.map((convo: any) => {
              // Check if there are unread messages (you may need to adjust this based on your API)
              const hasUnread = convo.unreadCount > 0;
              const lastMessage = convo.messages?.[0];
              
              return (
                <Link href={`/messages/${convo.id}`} key={convo.id}>
                  <Card className={`overflow-hidden hover:shadow-md transition-all ${
                    hasUnread 
                      ? 'border-[#0f8c27]/50 bg-[#0f8c27]/5 hover:border-[#0f8c27]' 
                      : 'hover:border-[#0f8c27]/30'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage src={convo.participants?.[0]?.image} />
                            <AvatarFallback className="bg-[#0f8c27]/10 text-[#0f8c27] font-semibold">
                              {convo.participants?.[0]?.name?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          {hasUnread && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-[#0f8c27] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{convo.unreadCount}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h3 className={`text-base truncate ${hasUnread ? 'font-bold' : 'font-semibold'}`}>
                              {convo.participants?.[0]?.name || 'Unknown User'}
                            </h3>
                            {lastMessage?.createdAt && (
                              <div className={`flex items-center gap-1 text-xs flex-shrink-0 ${
                                hasUnread ? 'text-[#0f8c27] font-semibold' : 'text-muted-foreground'
                              }`}>
                                <Clock className="h-3 w-3" />
                                <span>{new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            )}
                          </div>
                          <p className={`text-sm truncate ${
                            hasUnread ? 'text-foreground font-medium' : 'text-muted-foreground'
                          }`}>
                            {lastMessage?.content || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
