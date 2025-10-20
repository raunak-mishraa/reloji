import { Star } from "lucide-react"

interface RatingDisplayProps {
  rating: number
  maxRating?: number
  showNumber?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
}

export function RatingDisplay({ rating, maxRating = 5, showNumber = true, size = "md" }: RatingDisplayProps) {
  return (
    <div className="flex items-center gap-1" data-testid="rating-display">
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
              ? "fill-amber-200 text-amber-400"
              : "text-gray-300"
          }`}
        />
      ))}
      {showNumber && (
        <span className="text-sm font-medium ml-1" data-testid="text-rating-value">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
