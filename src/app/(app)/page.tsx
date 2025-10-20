'use client'
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { CategoryFilter } from "@/components/category-filter"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const featuredListings = [
  {
    id: "1",
    title: "Professional DSLR Camera Canon EOS R5",
    category: "Photography",
    pricePerDay: 45,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1606980633582-4a05b14e6f1c?w=600&h=450&fit=crop",
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: "2",
    title: "DeWalt Power Drill Set with Accessories",
    category: "Tools & DIY",
    pricePerDay: 15,
    location: "Oakland, CA",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=450&fit=crop",
    rating: 4.9,
    reviewCount: 18,
  },
  {
    id: "3",
    title: "Fender Stratocaster Electric Guitar",
    category: "Music",
    pricePerDay: 30,
    location: "San Jose, CA",
    image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&h=450&fit=crop",
    rating: 5.0,
    reviewCount: 12,
  },
  {
    id: "4",
    title: "Mountain Bike - Trek X-Caliber",
    category: "Sports",
    pricePerDay: 25,
    location: "Berkeley, CA",
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&h=450&fit=crop",
    rating: 4.7,
    reviewCount: 31,
  },
  {
    id: "5",
    title: "4-Person Camping Tent",
    category: "Outdoor",
    pricePerDay: 20,
    location: "Palo Alto, CA",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=450&fit=crop",
    rating: 4.6,
    reviewCount: 15,
  },
  {
    id: "6",
    title: "DJI Mavic Air 2 Drone",
    category: "Photography",
    pricePerDay: 55,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=450&fit=crop",
    rating: 4.9,
    reviewCount: 27,
  },
  {
    id: "7",
    title: "Pressure Washer - 3000 PSI",
    category: "Tools & DIY",
    pricePerDay: 35,
    location: "San Mateo, CA",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=450&fit=crop",
    rating: 4.8,
    reviewCount: 9,
  },
  {
    id: "8",
    title: "Keyboard Piano - Yamaha P-125",
    category: "Music",
    pricePerDay: 28,
    location: "Fremont, CA",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=450&fit=crop",
    rating: 4.7,
    reviewCount: 14,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={false} />
      
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
              <SearchBar placeholder="Search for cameras, tools, equipment..." />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
            <CategoryFilter />
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Featured Listings</h2>
              <Button variant="ghost" className="gap-2" data-testid="button-view-all">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-xl p-8 md:p-12 text-center space-y-4">
            <h2 className="text-3xl font-bold">Have items to share?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Turn your unused items into income. List them on BorrowHub and start earning today.
            </p>
            <Button size="lg" className="gap-2" data-testid="button-start-listing">
              Start Listing
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 BorrowHub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
