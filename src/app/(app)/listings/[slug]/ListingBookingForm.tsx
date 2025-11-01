"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ListingBookingForm({ listing }: { listing: any }) {
  const { data: session, status: sessionStatus } = useSession();
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  
  const isOwner = session?.user?.id && listing?.ownerId === session.user.id;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (listing.slug && session?.user?.id) {
      fetch(`/api/bookings/check?listingSlug=${listing.slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.hasBooking) {
            setHasExistingBooking(true);
          }
        })
        .catch(console.error);
    }
  }, [listing.slug, session]);

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

  if (isOwner) {
    return (
      <Alert className="bg-blue-50 border-blue-200 mt-6">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">This is your listing</AlertTitle>
        <AlertDescription className="text-blue-700">
          You cannot book your own item.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
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
      <form onSubmit={handleBookingRequest} className="space-y-4">
        <div>
          <label className="text-sm md:text-base font-medium mb-2 block">Rental period</label>
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
          className="w-full font-semibold" 
          size="lg"
          disabled={isBooking || sessionStatus !== 'authenticated'}
        >
          {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {sessionStatus !== 'authenticated' ? 'Sign in to book' : 'Request to Borrow'}
        </Button>
      </form>
      )}
       <p className="text-xs md:text-sm text-center text-muted-foreground leading-relaxed">
          You won't be charged until the owner approves your request
        </p>
    </div>
  );
}
