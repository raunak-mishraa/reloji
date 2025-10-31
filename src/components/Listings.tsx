"use client";

import { useState, useEffect } from "react";
import { ListingCard as SearchListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import ListingCardSkeleton from "@/components/ListingCardSkeleton";
import { Loader2, PackageOpen, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// This is a simplified version of the Listing type
interface Listing {
  id: string;
  slug: string;
  title: string;
  pricePerDay: number;
  images: { url: string }[];
  category?: { name: string };
  rating?: number;
  reviewCount?: number;
  location?: { city?: string };
}

type ListingsFilters = {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string; // ISO
  endDate?: string;   // ISO
  location?: string;
  distance?: number;
};

export default function Listings(props: ListingsFilters = {}) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  function buildQuery(cursor: string | null = null) {
    const qs = new URLSearchParams();
    if (props.search) qs.set("search", props.search);
    if (props.categoryId) qs.set("categoryId", props.categoryId);
    if (props.minPrice != null) qs.set("minPrice", String(props.minPrice));
    if (props.maxPrice != null) qs.set("maxPrice", String(props.maxPrice));
    if (props.startDate) qs.set("startDate", props.startDate);
    if (props.endDate) qs.set("endDate", props.endDate);
    if (props.location) qs.set("location", props.location);
    if (props.distance != null) qs.set("distance", String(props.distance));
    if (cursor) qs.set("cursor", cursor);
    return qs.toString();
  }

  async function fetchListings(cursor: string | null = null) {
    setIsLoading(true);
    setError(null);
    try {
      const query = buildQuery(cursor);
      const url = query ? `/api/listings?${query}` : "/api/listings";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }
      const data = await response.json();
      setListings((prev) => (cursor ? [...prev, ...data.listings] : data.listings));
      setNextCursor(data.nextCursor);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Refetch when filters change
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.search, props.categoryId, props.minPrice, props.maxPrice, props.startDate, props.endDate, props.location, props.distance]);

  if (isLoading && listings.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (listings.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-muted rounded-full p-6 mb-6">
          <PackageOpen className="h-16 w-16 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No listings found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Try adjusting your filters or be the first to list an item in this area!
        </p>
        <Button size="lg">Create a Listing</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <SearchListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            category={listing.category?.name ?? "General"}
            pricePerDay={listing.pricePerDay}
            location={listing.location?.city ?? "Unknown"}
            image={listing.images?.[0]?.url ?? "/placeholder.svg"}
            rating={listing.rating ?? 0}
            reviewCount={listing.reviewCount ?? 0}
          />
        ))}
      </div>
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {nextCursor && !isLoading && (
        <div className="text-center">
          <Button onClick={() => fetchListings(nextCursor)} size="lg">
            Load More Listings
          </Button>
        </div>
      )}
      {!nextCursor && !isLoading && listings.length > 0 && (
        <p className="text-center text-muted-foreground py-8">
          You've reached the end of the listings
        </p>
      )}
    </div>
  );
}
