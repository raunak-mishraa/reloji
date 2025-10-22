import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

// This is a simplified version of the Listing type
// You might want to create a shared types file for this
interface Listing {
  id: string;
  slug: string;
  title: string;
  pricePerDay: number;
  images: { url: string }[];
  category?: { name: string };
  rating?: number;
}

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.slug}`} className="group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 h-full">
        <CardHeader className="p-0 relative">
          <div className="relative w-full h-56 overflow-hidden">
            <Image
              src={listing.images[0]?.url || "/placeholder.svg"}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {listing.category && (
              <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 hover:bg-white">
                {listing.category.name}
              </Badge>
            )}
            {listing.rating && (
              <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-md flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{listing.rating}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">
              ${listing.pricePerDay}
            </p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
