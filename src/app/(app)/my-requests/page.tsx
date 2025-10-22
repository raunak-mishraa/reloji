"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// Define types for better type safety
type Listing = {
  id: string;
  title: string;
  images: { url: string }[];
};

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  listing: Listing;
};

export default function MyRequestsPage() {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/my-requests')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch your requests.');
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
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center py-12">Please <Link href="/api/auth/signin" className="underline">sign in</Link> to view your requests.</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">My Borrow Requests</h1>
      {requests.length === 0 ? (
        <p>You haven't made any borrow requests yet.</p>
      ) : (
        <div className="space-y-6">
          {requests.map(req => (
            <div key={req.id} className="border rounded-lg p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center">
                <img 
                  src={req.listing.images[0]?.url || '/placeholder.svg'} 
                  alt={req.listing.title} 
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div>
                  <Link href={`/listings/${req.listing.id}`} className="font-bold text-lg hover:underline">
                    {req.listing.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Dates: {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant={req.status === 'PENDING' ? 'default' : 'secondary'} className="capitalize">
                {req.status.toLowerCase()}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
