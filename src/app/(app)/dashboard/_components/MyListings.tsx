"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  status: string;
  pricePerDay: number;
  _count: { bookings: number };
  images: { url: string }[];
}

export default function MyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/listings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch listings');
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
  }, []);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Listing</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Price/Day</TableHead>
          <TableHead>Total Bookings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listings.map(listing => (
          <TableRow key={listing.id}>
            <TableCell>
              <Link href={`/listings/${listing.id}`} className="flex items-center space-x-4">
                <img src={listing.images[0]?.url || '/placeholder.svg'} alt={listing.title} className="w-16 h-16 object-cover rounded-md" />
                <span className="font-medium">{listing.title}</span>
              </Link>
            </TableCell>
            <TableCell><Badge>{listing.status}</Badge></TableCell>
            <TableCell>${listing.pricePerDay}</TableCell>
            <TableCell>{listing._count.bookings}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
