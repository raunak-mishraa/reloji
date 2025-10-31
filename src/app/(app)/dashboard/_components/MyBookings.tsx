"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Calendar, DollarSign, MessageSquare, Star, User, Package } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  listing: {
    title: string;
    images: { url: string }[];
  };
  borrower: {
    name: string | null;
    image: string | null;
  };
  borrowerId: string; // needed for user review
  conversation?: { id: string } | null;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/bookings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch bookings');
        return res.json();
      })
      .then(data => {
        setBookings(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleStatusUpdate = async (bookingId: string, status: 'APPROVED' | 'REJECTED') => {
    const originalBookings = [...bookings];
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'UPDATING' } : b));

    try {
      const endpoint = status === 'APPROVED'
        ? `/api/bookings/${bookingId}/approve`
        : `/api/bookings/${bookingId}/reject`;
      const response = await fetch(endpoint, { method: 'POST' });

      if (!response.ok) {
        const t = await response.text();
        throw new Error(t || 'Failed to update status');
      }

      const updatedBooking = await response.json();
      setBookings(bookings.map(b => b.id === bookingId ? updatedBooking : b));
    } catch (err: any) {
      setBookings(originalBookings);
      alert(err?.message || 'Failed to update booking status.');
    }
  };

  const openReview = (booking: Booking) => {
    setActiveBooking(booking);
    setRating(5);
    setComment("");
    setReviewOpen(true);
  };

  const submitUserReview = async () => {
    if (!activeBooking) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: activeBooking.id,
          toUserId: activeBooking.borrowerId,
          rating,
          comment,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to submit review');
      }
      setReviewOpen(false);
    } catch (e: any) {
      alert(e.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-[#0f8c27]" />
    </div>
  );
  
  if (error) return (
    <Card className="p-6 border-destructive/50 bg-destructive/5">
      <p className="text-destructive text-center">Error: {error}</p>
    </Card>
  );

  if (bookings.length === 0) {
    return (
      <Card className="p-8 md:p-12 text-center border-dashed">
        <Package className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg md:text-xl font-semibold mb-2">No bookings yet</h3>
        <p className="text-sm md:text-base text-muted-foreground">Your booking requests will appear here</p>
      </Card>
    );
  }

  return (
    <>
    <div className="space-y-4">
      {/* Desktop Table View */}
      <Card className="hidden md:block overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Listing</TableHead>
              <TableHead className="font-semibold">Borrower</TableHead>
              <TableHead className="font-semibold">Dates</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map(booking => (
              <TableRow key={booking.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={booking.listing?.images?.[0]?.url || '/placeholder.svg'}
                        alt={booking.listing?.title || 'Listing thumbnail'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium line-clamp-2">{booking.listing?.title || 'Listing'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <img src={booking.borrower?.image || '/placeholder.svg'} alt={booking.borrower?.name || ''} className="w-8 h-8 rounded-full" />
                    <span className="text-sm">{booking.borrower?.name || 'User'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d')}</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-[#0f8c27]">₹{(booking.totalAmount ?? 0).toFixed(0)}</TableCell>
                <TableCell>
                  <Badge variant={booking.status === 'APPROVED' ? 'default' : booking.status === 'PENDING' ? 'secondary' : 'outline'} className="capitalize">
                    {booking.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 flex-wrap">
                    {booking.status === 'PENDING' && (
                      <>
                        <Button size="sm" onClick={() => handleStatusUpdate(booking.id, 'APPROVED')} className="bg-[#0f8c27] hover:bg-[#0da024] h-8">Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(booking.id, 'REJECTED')} className="h-8">Decline</Button>
                      </>
                    )}
                    {booking.status === 'UPDATING' && <Loader2 className="h-4 w-4 animate-spin text-[#0f8c27]" />}
                    {(booking.status === 'COMPLETED' || booking.status === 'RETURNED') && (
                      <Button size="sm" variant="outline" onClick={() => openReview(booking)} className="h-8">
                        <Star className="h-3.5 w-3.5 mr-1" />
                        Rate
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild className="h-8">
                      <a href={booking?.conversation?.id ? `/messages/${booking.conversation.id}` : '/messages'}>
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        Message
                      </a>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {bookings.map(booking => (
          <Card key={booking.id} className="p-4">
            <div className="space-y-3">
              {/* Listing Info */}
              <div className="flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={booking.listing?.images?.[0]?.url || '/placeholder.svg'}
                    alt={booking.listing?.title || 'Listing'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">{booking.listing?.title || 'Listing'}</h3>
                  <Badge variant={booking.status === 'APPROVED' ? 'default' : booking.status === 'PENDING' ? 'secondary' : 'outline'} className="text-xs capitalize">
                    {booking.status.toLowerCase()}
                  </Badge>
                </div>
              </div>

              {/* Borrower Info */}
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <img src={booking.borrower?.image || '/placeholder.svg'} alt={booking.borrower?.name || ''} className="w-6 h-6 rounded-full" />
                  <span>{booking.borrower?.name || 'User'}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}</span>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-[#0f8c27]">₹{(booking.totalAmount ?? 0).toFixed(0)}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2 border-t">
                {booking.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleStatusUpdate(booking.id, 'APPROVED')} className="flex-1 bg-[#0f8c27] hover:bg-[#0da024]">Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(booking.id, 'REJECTED')} className="flex-1">Decline</Button>
                  </div>
                )}
                {booking.status === 'UPDATING' && (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-[#0f8c27]" />
                  </div>
                )}
                <div className="flex gap-2">
                  {(booking.status === 'COMPLETED' || booking.status === 'RETURNED') && (
                    <Button size="sm" variant="outline" onClick={() => openReview(booking)} className="flex-1">
                      <Star className="h-3.5 w-3.5 mr-1" />
                      Rate Borrower
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <a href={booking?.conversation?.id ? `/messages/${booking.conversation.id}` : '/messages'}>
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      Message
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>

    <AlertDialog open={reviewOpen} onOpenChange={setReviewOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rate borrower</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a rating (1-5) and an optional comment for your experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Rating (1-5)</label>
            <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium">Comment</label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share details about your experience (optional)" />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={submitUserReview} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit review'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
