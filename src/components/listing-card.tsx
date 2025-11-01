import { AuthCard } from "@/components/ui/auth-card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Star } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useState } from "react"

interface ListingCardProps {
  id: string;
  slug: string;
  title: string
  category: string
  pricePerDay: number
  location: string
  image: string
  rating: number
  reviewCount: number
  isFavorited?: boolean
}

export function ListingCard({
  slug,
  title,
  category,
  pricePerDay,
  location,
  image,
  rating,
  reviewCount,
  // isFavorited = false,
}: ListingCardProps) {
  // const [favorited, setFavorited] = useState(isFavorited)

  return (
    <AuthCard className="overflow-hidden border hover-elevate active-elevate-2 transition-shadow cursor-pointer" data-testid="card-listing">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        {/* <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={(e) => {
            e.stopPropagation()
            setFavorited(!favorited)
            console.log(`Favorited: ${!favorited}`)
          }}
          data-testid="button-favorite"
        >
          <Heart className={`h-4 w-4 ${favorited ? "fill-primary text-primary" : ""}`} />
        </Button> */}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base line-clamp-2 flex-1" data-testid="text-listing-title">
            {title}
          </h3>
        </div>
        <Badge variant="secondary" className="text-xs" data-testid="badge-category">
          {category}
        </Badge>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="text-xs" data-testid="text-location">{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium" data-testid="text-rating">{rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>
        <div className="pt-2 border-t">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-primary" data-testid="text-price">
              ₹{pricePerDay}
            </span>
            <span className="text-sm text-muted-foreground">/ day</span>
          </div>
        </div>
      </div>
    </AuthCard>
  )
}
