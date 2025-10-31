"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Trash2, Edit, Eye, Package } from 'lucide-react';
import Link from 'next/link';

interface Listing {
  id: string;
  slug: string;
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

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/listings/${slug}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete listing');
        }

        setListings(listings.filter(listing => listing.slug !== slug));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (listings.length === 0) {
    return (
      <Card className="p-8 md:p-12 text-center border-dashed">
        <Package className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg md:text-xl font-semibold mb-2">No listings yet</h3>
        <p className="text-sm md:text-base text-muted-foreground mb-4">Start earning by listing your items</p>
        <Button asChild size="sm" className="bg-[#0f8c27] hover:bg-[#0da024]">
          <Link href="/listings/new">Create Your First Listing</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <Card className="hidden md:block overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Listing</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Price/Day</TableHead>
              <TableHead className="font-semibold">Bookings</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map(listing => (
              <TableRow key={listing.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <Link href={`/listings/${listing.slug}`} className="flex items-center space-x-3 group">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={listing.images[0]?.url || '/placeholder.svg'} 
                        alt={listing.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                    <span className="font-medium group-hover:text-[#0f8c27] transition-colors line-clamp-2">{listing.title}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={listing.status === 'ACTIVE' ? 'default' : 'secondary'} className="capitalize">
                    {listing.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-[#0f8c27]">₹{listing.pricePerDay}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{listing._count.bookings}</span>
                    <span className="text-xs text-muted-foreground">total</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild className="hover:bg-[#0f8c27]/10 hover:text-[#0f8c27]">
                      <Link href={`/listings/${listing.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(listing.slug)} className="hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
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
        {listings.map(listing => (
          <Card key={listing.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              <Link href={`/listings/${listing.slug}`} className="flex-shrink-0">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img 
                    src={listing.images[0]?.url || '/placeholder.svg'} 
                    alt={listing.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </Link>
              
              <div className="flex-1 min-w-0">
                <Link href={`/listings/${listing.slug}`}>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1 hover:text-[#0f8c27]">{listing.title}</h3>
                </Link>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={listing.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-xs capitalize">
                    {listing.status.toLowerCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-sm font-semibold text-[#0f8c27]">₹{listing.pricePerDay}/day</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {listing._count.bookings} booking{listing._count.bookings !== 1 ? 's' : ''}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                      <Link href={`/listings/${listing.slug}`}>
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(listing.slug)} className="h-8 px-2 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
