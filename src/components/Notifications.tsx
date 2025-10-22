'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { pusherClient } from '@/lib/pusher';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';

async function getNotifications() {
  const res = await fetch('/api/notifications');
  if (!res.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return res.json();
}

async function markAsRead(notificationId: string) {
  await fetch(`/api/notifications/${notificationId}`, { method: 'PATCH' });
}

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function Notifications() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { data: notifications, isLoading, error } = useQuery<Notification[]>({ 
    queryKey: ['notifications'], 
    queryFn: getNotifications, 
    enabled: !!session 
  });

  const mutation = useMutation({ 
    mutationFn: markAsRead, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    pusherClient.subscribe(session.user.id);
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };
    pusherClient.bind('notifications:new', handler);

    return () => {
      pusherClient.unbind('notifications:new', handler);
      pusherClient.unsubscribe(session.user.id);
    };
  }, [queryClient, session?.user?.id]);

  const unreadCount = notifications?.filter((n: any) => !n.read).length || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-semibold">Notifications</div>
        {isLoading && <div className="p-2 text-sm text-muted-foreground">Loading...</div>}
        {error && <div className="p-2 text-sm text-red-500">Error loading notifications</div>}
        {notifications?.length === 0 && <div className="p-2 text-sm text-muted-foreground">No notifications</div>}
        {notifications?.map((n: Notification) => (
          <DropdownMenuItem key={n.id} onSelect={() => mutation.mutate(n.id)} className={`whitespace-normal ${!n.read ? 'bg-blue-50' : ''}`}>
            {n.message}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
