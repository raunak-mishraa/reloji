"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Check, X, Calendar, User, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#0f8c27]" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto py-12 px-4 md:px-8 text-center">
        <Card className="max-w-md mx-auto p-8">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your incoming requests.</p>
          <Button asChild className="bg-[#0f8c27] hover:bg-[#0da024]">
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-8">
        <Card className="max-w-md mx-auto p-6 border-destructive/50 bg-destructive/5">
          <p className="text-destructive text-center">Error: {error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[#0f8c27]/5">
      <div className="container mx-auto py-6 md:py-10 px-4 md:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Incoming Requests</h1>
          <p className="text-muted-foreground mt-1">Review and manage borrow requests</p>
        </div>

        {/* Empty State */}
        {requests.length === 0 ? (
          <Card className="p-8 md:p-12 text-center border-dashed">
            <Package className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg md:text-xl font-semibold mb-2">No incoming requests</h3>
            <p className="text-sm md:text-base text-muted-foreground">You'll see borrow requests here when users request your items</p>
          </Card>
        ) : (
          /* Requests List */
          <div className="space-y-4">
            {requests.map(req => (
              <Card key={req.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image and Info Section */}
                    <div className="flex gap-4 flex-1">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <img 
                          src={req.listing.images[0]?.url || '/placeholder.svg'} 
                          alt={req.listing.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-base md:text-lg mb-2 line-clamp-1">{req.listing.title}</h2>
                        
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{req.borrower.name || 'Anonymous'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {new Date(req.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(req.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <Badge variant={req.status === 'PENDING' ? 'default' : req.status === 'APPROVED' ? 'outline' : 'secondary'} className="capitalize text-xs">
                            {req.status.toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    {req.status === 'PENDING' && (
                      <div className="flex md:flex-col gap-2 md:justify-center md:min-w-[140px]">
                        <Button 
                          size="sm" 
                          className="flex-1 md:flex-none bg-[#0f8c27] hover:bg-[#0da024] gap-2" 
                          onClick={() => handleRequestAction(req.id, 'approve')}
                        >
                          <Check className="h-4 w-4" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="flex-1 md:flex-none gap-2" 
                          onClick={() => handleRequestAction(req.id, 'reject')}
                        >
                          <X className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
