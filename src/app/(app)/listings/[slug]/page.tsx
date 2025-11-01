import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata, ResolvingMetadata } from 'next';
import { MapPin, Shield, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingBookingForm from './ListingBookingForm';

interface ListingPageProps {
  params: { slug: string };
}

async function getListing(slug: string) {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      images: true,
      category: true,
      owner: {
        select: { id: true, name: true, image: true, createdAt: true },
      },
      reviews: {
        include: {
          reviewer: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  return listing;
}

export async function generateMetadata(
  { params }: ListingPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const listing = await getListing(params.slug);

  if (!listing) {
    return {
      title: 'Listing Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const firstImage = listing.images[0]?.url;

  const openGraphImages = firstImage ? [firstImage, ...previousImages] : previousImages;
  const twitterImages = firstImage ? [firstImage] : undefined;

  return {
    title: listing.title,
    description: listing.description.substring(0, 160),
    openGraph: {
      title: `${listing.title} on Reloji`,
      description: listing.description.substring(0, 160),
      images: openGraphImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${listing.title} on Reloji`,
      description: listing.description.substring(0, 160),
      images: twitterImages,
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listing = await getListing(params.slug);

  if (!listing) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Main Image */}
            <div className="aspect-[4/3] md:aspect-[3/2] rounded-lg md:rounded-xl overflow-hidden shadow-md">
              <img
                src={listing.images[0]?.url || '/placeholder.svg'}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {listing.images.slice(1, 5).map((img: any, idx: number) => (
                  <div key={idx} className="aspect-square rounded-md md:rounded-lg overflow-hidden cursor-pointer hover:opacity-80 hover:scale-105 transition-all shadow-sm">
                    <img
                      src={img.url}
                      alt={`View ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Title and Info Section */}
            <div className="space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-2">
                  <div className="flex-1">
                    <h1 className="text-2xl capitalize md:text-3xl lg:text-4xl font-bold mb-2 leading-tight">{listing.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{(listing.location as any)?.city || 'Location not set'}</span>
                      </div>
                      {listing.rating > 0 && (
                        <>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{listing.rating.toFixed(1)}</span>
                          </div>
                          <span>({listing.reviews.length} reviews)</span>
                        </>
                      )}
                    </div>
                  </div>
                  {listing.category && (
                    <Badge variant="secondary" className="shrink-0">{listing.category.name}</Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Owner Card */}
              {listing.owner && (
                <Card className="p-4 md:p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Avatar className="h-14 w-14 md:h-12 md:w-12">
                      <AvatarImage src={listing.owner.image || undefined} alt={listing.owner.name || ''} />
                      <AvatarFallback>{listing.owner.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base md:text-lg">{listing.owner.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                        <span className="whitespace-nowrap">Response rate: 98%</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap">Member since {new Date(listing.owner.createdAt).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              {/* Tabs for Description, Reviews, Location */}
              <Tabs defaultValue="description" className="space-y-4">
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">About this item</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {listing.description}
                    </p>
                  </div>

                  {listing.condition && (
                    <div>
                      <h3 className="font-semibold mb-2">Condition</h3>
                      <p className="text-muted-foreground capitalize">
                        {listing.condition.replace('_', ' ').toLowerCase()}
                      </p>
                    </div>
                  )}

                  {listing.rules && (
                    <div>
                      <h3 className="font-semibold mb-2">Rental rules</h3>
                      <p className="text-muted-foreground whitespace-pre-line text-sm">
                        {listing.rules}
                      </p>
                    </div>
                  )}

                  {listing.cancellationPolicy && (
                    <div>
                      <h3 className="font-semibold mb-2">Cancellation Policy</h3>
                      <p className="text-muted-foreground whitespace-pre-line text-sm">
                        {listing.cancellationPolicy}
                      </p>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Your safety is our priority</p>
                      <p className="text-muted-foreground">
                        All transactions are handled directly between you and the owner. Reloji does not process payments for rentals.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {listing.rating > 0 ? (
                    <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
                      <div className="text-center">
                        <div className="text-4xl font-bold">{listing.rating.toFixed(1)}</div>
                        <div className="flex items-center justify-center gap-1 my-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="text-sm text-muted-foreground">Based on {listing.reviews.length} reviews</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No reviews yet</p>
                    </div>
                  )}
                  
                  {listing.reviews && listing.reviews.length > 0 && (
                    <div className="space-y-4">
                      {listing.reviews.map((review: any, i: number) => (
                        <Card key={i} className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={review.reviewer?.image || undefined} />
                              <AvatarFallback>{review.reviewer?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{review.reviewer?.name}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">{review.rating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="location">
                  {(listing.location as any)?.coords?.lat && (listing.location as any)?.coords?.lng ? (
                    <div className="space-y-3">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        {(() => {
                          const lat = (listing.location as any).coords.lat as number;
                          const lng = (listing.location as any).coords.lng as number;
                          const delta = 0.01;
                          const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join('%2C');
                          const marker = `${lat}%2C${lng}`;
                          const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
                          return <iframe title="map" className="w-full h-full" src={src} />;
                        })()}
                      </div>
                      <p className="text-sm text-muted-foreground">{(listing.location as any)?.city}</p>
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-2" />
                        <p>Map view unavailable</p>
                        <p className="text-sm">{(listing.location as any)?.city || 'Location not specified'}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Booking Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <Card className="p-5 md:p-6 space-y-4 md:space-y-6 lg:sticky lg:top-24">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl md:text-3xl font-bold text-primary">₹{listing.pricePerDay}</span>
                <span className="text-sm md:text-base text-muted-foreground">/ day</span>
              </div>
              {listing.depositAmount && (
                <p className="text-sm text-muted-foreground">+ ₹{listing.depositAmount} deposit</p>
              )}
              <ListingBookingForm listing={listing} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
