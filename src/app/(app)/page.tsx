'use client'
import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Listings from "@/components/Listings";
import CategoryGrid from "@/components/CategoryGrid";

export default function Home() {
  const [filters, setFilters] = useState<{ search?: string }>({});

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Borrow Anything, Anytime
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Discover thousands of items available for rent in your community. From cameras to tools, music gear to sports equipment.
            </p>
            <div className="max-w-2xl mx-auto pt-4">
              <SearchBar placeholder="Search for cameras, tools, equipment..." onSearch={(query) => setFilters(prev => ({...prev, search: query}))} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-8">
        <div className="space-y-12">
          <CategoryGrid />

          <div>
            <h2 className="text-2xl font-bold mb-6">Featured Listings</h2>
            <Listings />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Nearby Listings</h2>
            <Listings />
          </div>

          <div className="bg-muted rounded-xl p-8 md:p-12 text-center space-y-4">
            <h2 className="text-3xl font-bold">Have items to share?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Turn your unused items into income. List them on Reloji and start earning today.
            </p>
            <Button size="lg" className="gap-2" data-testid="button-start-listing" asChild>
              <Link href="/listings/new">
                Start Listing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
