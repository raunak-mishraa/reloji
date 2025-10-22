"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

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
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center py-12">Please <Link href="/api/auth/signin" className="underline">sign in</Link> to view your listings.</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link href="/listings/new" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-semibold">
          Create New Listing
        </Link>
      </div>
      {listings.length === 0 ? (
        <p>You haven't created any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <div key={listing.id} className="border rounded-lg overflow-hidden shadow-lg">
              <Link href={`/listings/${listing.id}`}>
                <img 
                  src={listing.images[0]?.url || '/placeholder.svg'} 
                  alt={listing.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-bold text-lg truncate">{listing.title}</h2>
                  <p className="text-muted-foreground">${listing.pricePerDay}/day</p>
                  <p className="text-sm capitalize mt-2">Status: {listing.status.toLowerCase()}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
