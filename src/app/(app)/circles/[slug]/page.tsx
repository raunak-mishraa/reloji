import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata, ResolvingMetadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Lock, Package } from 'lucide-react';
import Link from 'next/link';
import { ListingCard } from '@/components/listing-card';
import { Button } from '@/components/ui/button';
import CircleMembershipButton from './CircleMembershipButton';

interface CirclePageProps {
  params: { slug: string };
}

async function getCircle(slug: string, userId?: string) {
  const circle = await prisma.circle.findUnique({
    where: { slug },
    include: {
      creator: { select: { name: true, image: true } },
      _count: { select: { members: true, listings: true } },
      listings: {
        include: {
          images: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!circle) return null;

  const isMember = userId
    ? (await prisma.circleMember.count({
        where: { circleId: circle.id, userId },
      })) > 0
    : false;

  return { ...circle, isMember };
}

export async function generateMetadata(
  { params }: CirclePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  const circle = await getCircle(params.slug, session?.user?.id);

  if (!circle) {
    return { title: 'Circle Not Found' };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const bannerImage = circle.bannerImage;

  return {
    title: circle.name,
    description: circle.description?.substring(0, 160) || `Join the ${circle.name} circle on Reloji.`,
    openGraph: {
      title: `${circle.name} on Reloji`,
      description: circle.description?.substring(0, 160) || `A community for sharing and renting items.`,
      images: bannerImage ? [bannerImage, ...previousImages] : previousImages,
    },
  };
}

export default async function CirclePage({ params }: CirclePageProps) {
  const session = await getServerSession(authOptions);
  const circle = await getCircle(params.slug, session?.user?.id);
  
  if (!circle) {
    notFound();
  }

  const listings = circle.listings;

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
                    <AvatarImage src={circle.creator.image || undefined} />
                    <AvatarFallback>{circle.creator.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">{circle.creator.name}</span>
                </div>
              </div>
              
              <CircleMembershipButton circle={circle} isMemberInitial={circle.isMember} />
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
                <ListingCard
                  id={listing.id}
                  slug={listing.slug}
                  title={listing.title}
                  category={listing.category?.name ?? "General"}
                  pricePerDay={listing.pricePerDay}
                  location={(listing.location as any)?.city ?? "Unknown"}
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
