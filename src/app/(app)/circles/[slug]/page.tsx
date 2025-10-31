'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Users, Lock } from 'lucide-react';
import Link from 'next/link';
import { ListingCard as SearchListingCard } from '@/components/listing-card';

interface Circle {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string | null;
  privacy: 'PUBLIC' | 'PRIVATE';
  creator: { name: string; image: string };
  _count: { members: number; listings: number };
  isMember: boolean;
}

interface Listing {
  id: string;
  title: string;
  slug: string;
  pricePerDay: number;
  images: { url: string }[];
  category?: { name: string };
  rating?: number;
  location?: any;
}

export default function CirclePage() {
  const { slug } = useParams();
  const { data: session } = useSession();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      Promise.all([
        fetch(`/api/circles/${slug}`).then(res => res.json()),
        fetch(`/api/circles/${slug}/listings`).then(res => res.json()),
      ])
        .then(([circleData, listingsData]) => {
          if (circleData.error) throw new Error(circleData.error);
          if (listingsData.error) throw new Error(listingsData.error);
          setCircle(circleData);
          setListings(listingsData);
        })
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  const handleMembership = async () => {
    if (!session) return; // Or prompt to sign in
    setIsJoining(true);
    const method = circle?.isMember ? 'DELETE' : 'POST';

    try {
      const response = await fetch(`/api/circles/${slug}/members`, { method });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to ${method === 'POST' ? 'join' : 'leave'} circle`);
      }
      // Refresh circle data to update membership status and member count
      const updatedCircle = await fetch(`/api/circles/${slug}`).then(res => res.json());
      setCircle(updatedCircle);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  if (error) return <div className="text-center text-red-500 py-20">Error: {error}</div>;
  if (!circle) return <div className="text-center py-20">Circle not found.</div>;

  const Banner = () => (
    <div className="relative h-64 md:h-80 w-full overflow-hidden">
      {circle.bannerImage ? (
        <img src={circle.bannerImage} alt={`${circle.name} banner`} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen">
      <Banner />
      
      <div className="container mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-xl p-6 md:p-8 shadow-xl mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight capitalize">{circle.name}</h1>
                {circle.privacy === 'PRIVATE' && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs font-medium">
                    <Lock className="h-3 w-3" />
                    <span>Private</span>
                  </div>
                )}
              </div>
              
              {circle.description && (
                <p className="text-lg text-muted-foreground mb-6 max-w-3xl">{circle.description}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{circle._count.members}</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{circle._count.listings}</p>
                    <p className="text-xs text-muted-foreground">Items Shared</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-6 pt-6 border-t">
                <span className="text-sm text-muted-foreground">Created by</span>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={circle.creator.image} />
                  <AvatarFallback>{circle.creator.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{circle.creator.name}</span>
              </div>
            </div>
            
            {session && (
              <Button 
                onClick={handleMembership} 
                disabled={isJoining}
                size="lg"
                className="md:mt-0"
              >
                {isJoining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {circle.isMember ? 'Leave Circle' : 'Join Circle'}
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Items in this Circle</h2>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listings.map(listing => (
                <Link href={`/listings/${listing.slug}`} key={listing.id}>
                <SearchListingCard
                  id={listing.id}
                  slug={listing.slug}
                  title={listing.title}
                  category={listing.category?.name ?? "General"}
                  pricePerDay={listing.pricePerDay}
                  location={listing.location?.city ?? "Unknown"}
                  image={listing.images?.[0]?.url ?? "/placeholder.svg"}
                  rating={listing.rating ?? 0}
                  reviewCount={0}
                />
              </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No items yet</h3>
                <p className="text-muted-foreground">Be the first to share an item in this circle!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
