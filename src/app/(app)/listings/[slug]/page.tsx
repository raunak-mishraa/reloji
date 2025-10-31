"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, MapPin, Shield, Calendar, Star, MessageCircle, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ListingPage() {
  const { slug } = useParams();
  const { data: session, status: sessionStatus } = useSession();
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  
  // Check if current user is the owner
  const isOwner = session?.user?.id && listing?.ownerId === session.user.id;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Load listing
  useEffect(() => {
    if (slug) {
      fetch(`/api/listings/${slug}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch listing');
          return res.json();
        })
        .then(data => {
          setListing(data);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [slug]);

  // Check for existing booking
  useEffect(() => {
    if (slug && session?.user?.id) {
      fetch(`/api/bookings/check?listingSlug=${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.hasBooking) {
            setHasExistingBooking(true);
          }
        })
        .catch(console.error);
    }
  }, [slug, session]);

  // Payment integration removed: no external SDK required.

  const handleBookingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setBookingError("Please sign in to make a booking.");
      return;
    }
    setIsBooking(true);
    setBookingError(null);
    setBookingSuccess(false);
    

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id, startDate, endDate }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create booking');
      }

      await response.json();
      setBookingSuccess(true);
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  if (error) return <div className="text-center text-red-500 py-12">Error: {error}</div>;
  if (!listing) return <div className="text-center py-12">Listing not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="aspect-[3/2] rounded-xl overflow-hidden">
              <img
                src={listing.images[0]?.url || '/placeholder.svg'}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.slice(1, 5).map((img: any, idx: number) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
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
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.location?.city || 'Location not set'}</span>
                      </div>
                      {listing.rating > 0 && (
                        <>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{listing.rating.toFixed(1)}</span>
                          </div>
                          <span>(24 reviews)</span>
                        </>
                      )}
                    </div>
                  </div>
                  {listing.category && (
                    <Badge variant="secondary">{listing.category.name}</Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Owner Card */}
              {listing.owner && (
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={listing.owner.image} alt={listing.owner.name} />
                      <AvatarFallback>{listing.owner.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{listing.owner.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>Response rate: 98%</span>
                        <span>•</span>
                        <span>Member since {new Date(listing.owner.createdAt).getFullYear()}</span>
                      </div>
                    </div>
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </Card>
              )}
              {/* Tabs for Description, Reviews, Location */}
              <Tabs defaultValue="description" className="space-y-4">
                <TabsList>
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
                      <p className="font-medium">Protected by Reloji</p>
                      <p className="text-muted-foreground">
                        All rentals are covered by our protection plan. Your deposit is held securely and refunded after safe return.
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
                        <div className="text-sm text-muted-foreground">Based on reviews</div>
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
                              <AvatarImage src={review.reviewer?.image} />
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
                  {listing.location?.coords?.lat && listing.location?.coords?.lng ? (
                    <div className="space-y-3">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        {(() => {
                          const lat = listing.location.coords.lat as number;
                          const lng = listing.location.coords.lng as number;
                          const delta = 0.01;
                          const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join('%2C');
                          const marker = `${lat}%2C${lng}`;
                          const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
                          return <iframe title="map" className="w-full h-full" src={src} />;
                        })()}
                      </div>
                      <p className="text-sm text-muted-foreground">{listing.location?.city}</p>
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-2" />
                        <p>Map view unavailable</p>
                        <p className="text-sm">{listing.location?.city || 'Location not specified'}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Booking Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <Card className="p-6 space-y-6 sticky top-24">
              {/* Price */}
              <div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">₹{listing.pricePerDay}</span>
                  <span className="text-muted-foreground">/ day</span>
                </div>
                {listing.depositAmount && (
                  <p className="text-sm text-muted-foreground">+ ₹{listing.depositAmount} deposit</p>
                )}
              </div>

              {/* Booking Form or Owner Message */}
              {isOwner ? (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">This is your listing</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    You cannot book your own item.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {bookingError && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{bookingError}</AlertDescription>
                    </Alert>
                  )}
                  {bookingSuccess && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertTitle className="text-green-800">Booking Created</AlertTitle>
                      <AlertDescription className="text-green-700">Your request has been submitted.</AlertDescription>
                    </Alert>
                  )}

                  {hasExistingBooking ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Already Booked</AlertTitle>
                      <AlertDescription>
                        You already have an active or pending booking for this item.
                      </AlertDescription>
                    </Alert>
                  ) : (
                  <form onSubmit={handleBookingRequest} className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Rental period</label>
                      <div className="space-y-2">
                        <input 
                          type="date" 
                          value={startDate} 
                          onChange={e => setStartDate(e.target.value)} 
                          required 
                          className="w-full px-3 py-2 rounded-md border border-input bg-background" 
                          placeholder="Start date"
                        />
                        <input 
                          type="date" 
                          value={endDate} 
                          onChange={e => setEndDate(e.target.value)} 
                          required 
                          className="w-full px-3 py-2 rounded-md border border-input bg-background" 
                          placeholder="End date"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isBooking || sessionStatus !== 'authenticated'}
                    >
                      {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {sessionStatus !== 'authenticated' ? 'Sign in to book' : 'Request to Borrow'}
                    </Button>
                  </form>
                  )}
                </>
              )}

              <p className="text-xs text-center text-muted-foreground">
                You won't be charged until the owner approves your request
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
