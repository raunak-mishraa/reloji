"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Info, ShieldCheck, CalendarClock, Star, Tag } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ListingPage() {
  const { slug } = useParams();
  const { data: session, status: sessionStatus } = useSession();
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

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

  // Inject Razorpay script when needed (browser only)
  useEffect(() => {
    const existing = document.getElementById('rzp-checkout-js');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'rzp-checkout-js';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleBookingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setBookingError("Please sign in to make a booking.");
      return;
    }
    setIsBooking(true);
    setBookingError(null);
    setBookingSuccess(false);
    setPaymentSuccess(false);

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

      const booking = await response.json();
      setBookingSuccess(true);

      // Create Razorpay order for this booking
      const orderRes = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      if (!orderRes.ok) {
        const err = await orderRes.text();
        throw new Error(err || 'Failed to create payment order');
      }
      const order = await orderRes.json();

      // @ts-ignore - Razorpay is injected globally
      const RazorpayCheckout = (window as any).Razorpay;
      if (!RazorpayCheckout) {
        throw new Error('Payment SDK not loaded');
      }

      const rzp = new RazorpayCheckout({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Reloji',
        description: order.listingTitle,
        order_id: order.orderId,
        handler: async (resp: any) => {
          try {
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                bookingId: booking.id,
              }),
            });
            if (!verifyRes.ok) {
              const t = await verifyRes.text();
              throw new Error(t || 'Payment verification failed');
            }
            setPaymentSuccess(true);
          } catch (verErr: any) {
            setBookingError(verErr.message);
          }
        },
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
        },
        theme: { color: '#6d28d9' },
      });
      rzp.open();
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
    <div className="container mx-auto py-12 px-4">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
          <div className="mb-8">
            <img src={listing.images[0]?.url || '/placeholder.svg'} alt={listing.title} className="w-full h-auto rounded-lg shadow-lg" />
          </div>
          <h2 className="text-2xl font-bold mt-8 mb-4">About this listing</h2>
          <p className="text-gray-600 whitespace-pre-line">{listing.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-sm">
            {listing.condition &&
              <div className="flex items-start">
                <Tag className="h-5 w-5 text-primary mr-3"/>
                <div>
                  <h4 className="font-semibold">Condition</h4>
                  <p className="text-gray-600 capitalize">{listing.condition.replace('_', ' ').toLowerCase()}</p>
                </div>
              </div>
            }
            {listing.rating > 0 &&
              <div className="flex items-start">
                <Star className="h-5 w-5 text-primary mr-3"/>
                <div>
                  <h4 className="font-semibold">Rating</h4>
                  <p className="text-gray-600">{listing.rating.toFixed(1)} / 5.0</p>
                </div>
              </div>
            }
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-sm">
            {listing.rules && 
              <div className="flex items-start">
                <Info className="h-5 w-5 text-primary mr-3"/>
                <div>
                  <h4 className="font-semibold">Rental Rules</h4>
                  <p className="text-gray-600 whitespace-pre-line">{listing.rules}</p>
                </div>
              </div>
            }
            {listing.cancellationPolicy && 
              <div className="flex items-start">
                <ShieldCheck className="h-5 w-5 text-primary mr-3"/>
                <div>
                  <h4 className="font-semibold">Cancellation Policy</h4>
                  <p className="text-gray-600 whitespace-pre-line">{listing.cancellationPolicy}</p>
                </div>
              </div>
            }
            {listing.maxBorrowDuration && 
              <div className="flex items-start">
                <CalendarClock className="h-5 w-5 text-primary mr-3"/>
                <div>
                  <h4 className="font-semibold">Max Duration</h4>
                  <p className="text-gray-600">{listing.maxBorrowDuration} days</p>
                </div>
              </div>
            }
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-24 p-6 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">₹{listing.pricePerDay} <span className="text-base font-normal text-muted-foreground">/ day</span></h2>
            
            <form onSubmit={handleBookingRequest} className="space-y-4">
              {bookingError && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{bookingError}</AlertDescription></Alert>}
              {bookingSuccess && !paymentSuccess && <Alert variant="default"><AlertTitle>Booking Created</AlertTitle><AlertDescription>Proceeding to payment...</AlertDescription></Alert>}
              {paymentSuccess && <Alert variant="default"><AlertTitle>Payment Successful</AlertTitle><AlertDescription>Your booking is confirmed.</AlertDescription></Alert>}

              <div>
                <label htmlFor="start-date" className="block text-sm font-medium">Start Date</label>
                <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium">End Date</label>
                <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <button type="submit" disabled={isBooking || sessionStatus !== 'authenticated'} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-semibold flex items-center justify-center">
                {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                {sessionStatus !== 'authenticated' ? 'Sign in to book' : 'Request to Book'}
              </button>
            </form>
            
            <div className="mt-6 text-sm text-center text-muted-foreground">
              You won't be charged yet
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
