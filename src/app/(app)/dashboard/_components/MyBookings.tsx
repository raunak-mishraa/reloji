"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
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

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Listing</TableHead>
          <TableHead>Borrower</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map(booking => (
          <TableRow key={booking.id}>
            <TableCell>
              <div className="flex items-center space-x-4">
                <img
                  src={booking.listing?.images?.[0]?.url || '/placeholder.svg'}
                  alt={booking.listing?.title || 'Listing thumbnail'}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <span className="font-medium">{booking.listing?.title || 'Listing'}</span>
              </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <img src={booking.borrower?.image || '/placeholder.svg'} alt={booking.borrower?.name || ''} className="w-8 h-8 rounded-full" />
                    <span>{booking.borrower?.name || 'User'}</span>
                </div>
            </TableCell>
            <TableCell>{format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}</TableCell>
            <TableCell>${(booking.totalAmount ?? 0).toFixed(2)}</TableCell>
            <TableCell><Badge>{booking.status}</Badge></TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {booking.status === 'PENDING' && (
                  <>
                    <Button size="sm" onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}>Decline</Button>
                  </>
                )}
                {booking.status === 'UPDATING' && <Loader2 className="h-4 w-4 animate-spin" />}
                {(booking.status === 'COMPLETED' || booking.status === 'RETURNED') && (
                  <Button size="sm" variant="secondary" onClick={() => openReview(booking)}>Rate borrower</Button>
                )}
                <a href={booking?.conversation?.id ? `/messages/${booking.conversation.id}` : '/messages'}>
                  <Button size="sm" variant="outline">Message</Button>
                </a>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

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
