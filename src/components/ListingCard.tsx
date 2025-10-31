import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, User, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  location?: any;
  condition?: string;
  owner?: { name: string; image?: string };
  depositAmount?: number;
}

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const locationText = listing.location?.city || 'Location not set';
  const conditionText = listing.condition?.replace('_', ' ') || '';

  return (
    <Link href={`/listings/${listing.slug}`} className="group">
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border hover:border-primary/50 h-full flex flex-col">
        <CardHeader className="p-0 relative">
          <div className="relative w-full h-64 overflow-hidden bg-muted">
            <Image
              src={listing.images[0]?.url || "/placeholder.svg"}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {listing.category && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground shadow-lg">
                {listing.category.name}
              </Badge>
            )}
            {listing.rating && (
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900">{listing.rating.toFixed(1)}</span>
              </div>
            )}
            
            {/* Location badge at bottom */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-gray-900">{locationText}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col gap-3">
          <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {listing.title}
          </h3>
          
          {/* Condition badge */}
          {conditionText && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-muted-foreground capitalize">{conditionText}</span>
            </div>
          )}
          
          {/* Owner info */}
          {listing.owner && (
            <div className="flex items-center gap-2 mt-auto">
              <Avatar className="h-6 w-6">
                <AvatarImage src={listing.owner.image} alt={listing.owner.name} />
                <AvatarFallback className="text-xs">{listing.owner.name?.[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{listing.owner.name}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-end justify-between border-t bg-muted/30">
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground mb-0.5">From</p>
            <p className="text-2xl font-bold text-primary flex items-baseline gap-1">
              ₹{listing.pricePerDay}
              <span className="text-xs font-normal text-muted-foreground">/day</span>
            </p>
          </div>
          {listing.depositAmount && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Deposit</p>
              <p className="text-sm font-semibold text-gray-700">₹{listing.depositAmount}</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
