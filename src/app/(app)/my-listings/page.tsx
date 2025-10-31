"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, PlusCircle, Package, Eye, Edit } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Define a type for the listing object for better type safety
type Listing = {
  id: string;
  title: string;
  images: { url: string }[];
  pricePerDay: number;
  status: string;
};

export default function MyListingsPage() {
  const { data: session, status } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/my-listings')
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch your listings.');
          }
          return res.json();
        })
        .then(data => {
          setListings(data);
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
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#0f8c27]" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Card className="max-w-md mx-auto p-8">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your listings.</p>
          <Button asChild className="bg-[#0f8c27] hover:bg-[#0da024]">
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
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
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Listings</h1>
            <p className="text-muted-foreground mt-1">Manage and track your listings</p>
          </div>
          <Button asChild size="sm" className="bg-[#0f8c27] hover:bg-[#0da024] gap-2 shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto">
            <Link href="/listings/new">
              <PlusCircle className="h-4 w-4" />
              Create Listing
            </Link>
          </Button>
        </div>

        {/* Empty State */}
        {listings.length === 0 ? (
          <Card className="p-8 md:p-12 text-center border-dashed">
            <Package className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg md:text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4">Start earning by listing your items</p>
            <Button asChild size="sm" className="bg-[#0f8c27] hover:bg-[#0da024]">
              <Link href="/listings/new">Create Your First Listing</Link>
            </Button>
          </Card>
        ) : (
          /* Listings Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listings.map(listing => (
              <Card key={listing.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#0f8c27]/10 hover:-translate-y-1">
                {/* Image Section */}
                <Link href={`/listings/${listing.id}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img 
                      src={listing.images[0]?.url || '/placeholder.svg'} 
                      alt={listing.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge 
                      variant={listing.status === 'ACTIVE' ? 'default' : 'secondary'} 
                      className="absolute top-2 right-2 capitalize text-xs"
                    >
                      {listing.status.toLowerCase()}
                    </Badge>
                  </div>
                </Link>
                
                {/* Content Section */}
                <CardContent className="p-4 space-y-3">
                  <Link href={`/listings/${listing.id}`}>
                    <h2 className="font-semibold text-base line-clamp-2 group-hover:text-[#0f8c27] transition-colors min-h-[3rem]">
                      {listing.title}
                    </h2>
                  </Link>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-lg text-[#0f8c27]">₹{listing.pricePerDay}</span>
                    <span className="text-sm text-muted-foreground">/day</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" asChild className="flex-1 h-8 text-xs">
                      <Link href={`/listings/${listing.id}`}>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="flex-1 h-8 text-xs hover:bg-[#0f8c27]/10 hover:text-[#0f8c27]">
                      <Link href={`/listings/${listing.id}`}>
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Link>
                    </Button>
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
