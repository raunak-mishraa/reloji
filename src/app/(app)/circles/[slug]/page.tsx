'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Users, Lock, Package, UserPlus, UserMinus } from 'lucide-react';
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

  if (isLoading) return (
    <div className="min-h-screen">
      <div className="relative h-48 md:h-64 w-full overflow-hidden bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 animate-pulse" />
      
      <div className="container mx-auto px-4 md:px-8 -mt-24 relative z-10">
        <Card className="bg-background/95 backdrop-blur border shadow-2xl mb-12">
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="h-10 bg-muted rounded-lg w-64 animate-pulse" />
                  <div className="h-5 bg-muted rounded w-96 animate-pulse" />
                </div>
                
                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 bg-muted rounded-xl animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-7 w-12 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 bg-muted rounded-xl animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-7 w-12 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-6 border-t">
                  <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
              
              <div className="h-12 w-40 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </Card>

        <div className="mb-12">
          <div className="mb-8 space-y-2">
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
            <div className="h-5 w-96 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  if (error) return <div className="text-center text-red-500 py-20">Error: {error}</div>;
  if (!circle) return <div className="text-center py-20">Circle not found.</div>;

  const Banner = () => (
    <div className="relative h-48 md:h-64 w-full overflow-hidden">
      {circle.bannerImage ? (
        <img src={circle.bannerImage} alt={`${circle.name} banner`} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen">
      <Banner />
      
      <div className="container mx-auto px-4 md:px-8 -mt-24 relative z-10">
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border shadow-2xl mb-12">
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight capitalize">{circle.name}</h1>
                    {circle.privacy === 'PRIVATE' && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-medium">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Private</span>
                      </div>
                    )}
                  </div>
                  
                  {circle.description && (
                    <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">{circle.description}</p>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{circle._count.members}</p>
                      <p className="text-sm text-muted-foreground">Members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{circle._count.listings}</p>
                      <p className="text-sm text-muted-foreground">Items</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-6 border-t">
                  <span className="text-sm text-muted-foreground">Created by</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={circle.creator.image} />
                    <AvatarFallback>{circle.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">{circle.creator.name}</span>
                </div>
              </div>
              
              {session && (
                <Button 
                  onClick={handleMembership} 
                  disabled={isJoining}
                  size="lg"
                  variant={circle.isMember ? "outline" : "default"}
                  className="md:mt-0 min-w-[160px] font-medium"
                >
                  {isJoining ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : circle.isMember ? (
                    <UserMinus className="mr-2 h-4 w-4" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  {circle.isMember ? 'Leave Circle' : 'Join Circle'}
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Items in this Circle</h2>
            <p className="text-muted-foreground">Browse all items shared by circle members</p>
          </div>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <Card className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">No items yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to share an item in this circle!</p>
                {session && circle.isMember && (
                  <Button asChild>
                    <Link href="/listings/new">Share an Item</Link>
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
