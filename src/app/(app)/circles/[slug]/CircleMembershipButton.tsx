"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';

export default function CircleMembershipButton({ circle, isMemberInitial }: { circle: any, isMemberInitial: boolean }) {
  const { data: session } = useSession();
  const [isMember, setIsMember] = useState(isMemberInitial);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null); // Not used, but good for future error handling

  useEffect(() => {
    setIsMember(isMemberInitial);
  }, [isMemberInitial]);

  const handleMembership = async () => {
    if (!session) return; // Or prompt to sign in
    setIsJoining(true);
    const method = isMember ? 'DELETE' : 'POST';

    try {
      const response = await fetch(`/api/circles/${circle.slug}/members`, { method });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to ${method === 'POST' ? 'join' : 'leave'} circle`);
      }
      setIsMember(!isMember);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsJoining(false);
    }
  };

  if (!session) return null;

  return (
    <Button 
      onClick={handleMembership} 
      disabled={isJoining}
      size="lg"
      variant={isMember ? "outline" : "default"}
      className="md:mt-0 min-w-[160px] font-medium"
    >
      {isJoining ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isMember ? (
        <UserMinus className="mr-2 h-4 w-4" />
      ) : (
        <UserPlus className="mr-2 h-4 w-4" />
      )}
      {isMember ? 'Leave Circle' : 'Join Circle'}
    </Button>
  );
}
