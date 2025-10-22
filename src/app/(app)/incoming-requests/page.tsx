"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define types for better type safety
type Borrower = {
  name: string | null;
  image: string | null;
};

type Listing = {
  title: string;
  images: { url: string }[];
};

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  listing: Listing;
  borrower: Borrower;
};

export default function IncomingRequestsPage() {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = () => {
    if (status === 'authenticated') {
      setIsLoading(true);
      fetch('/api/incoming-requests')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch requests.');
          return res.json();
        })
        .then(data => {
          setRequests(data);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchRequests();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status]);

  const handleRequestAction = async (bookingId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/${action}`, {
        method: 'POST',
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Failed to ${action} request.`);
      }
      // Refresh the list of requests after a successful action
      fetchRequests();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center py-12">Please <Link href="/api/auth/signin" className="underline">sign in</Link> to view your incoming requests.</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Incoming Borrow Requests</h1>
      {requests.length === 0 ? (
        <p>You have no incoming borrow requests.</p>
      ) : (
        <div className="space-y-6">
          {requests.map(req => (
            <div key={req.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
              <div className="flex items-center mb-4 md:mb-0">
                <img 
                  src={req.listing.images[0]?.url || '/placeholder.svg'} 
                  alt={req.listing.title} 
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div>
                  <h2 className="font-bold text-lg">{req.listing.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Requested by: {req.borrower.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Dates: {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                  </p>
                  <Badge variant={req.status === 'PENDING' ? 'default' : 'secondary'} className="mt-2 capitalize">
                    {req.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
              {req.status === 'PENDING' && (
                <div className="flex space-x-2 self-end md:self-center">
                  <Button size="sm" variant="outline" onClick={() => handleRequestAction(req.id, 'approve')}>
                    <Check className="h-4 w-4 mr-2" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleRequestAction(req.id, 'reject')}>
                    <X className="h-4 w-4 mr-2" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
