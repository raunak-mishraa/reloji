import { Card } from "@/components/ui/card"
import { UserAvatar } from "@/components/user-avatar"
import { RatingDisplay } from "@/components/rating-display"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface ReviewCardProps {
  reviewerName: string
  reviewerImage?: string
  rating: number
  comment: string
  date: Date
  verified?: boolean
}

export function ReviewCard({
  reviewerName,
  reviewerImage,
  rating,
  comment,
  date,
  verified = false,
}: ReviewCardProps) {
  return (
    <Card className="p-4 space-y-3" data-testid="card-review">
      <div className="flex items-start gap-3">
        <UserAvatar name={reviewerName} image={reviewerImage} size="md" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium" data-testid="text-reviewer-name">{reviewerName}</span>
            {verified && (
              <Badge variant="secondary" className="text-xs">
                Verified Borrower
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <RatingDisplay rating={rating} showNumber={false} size="sm" />
            <span className="text-xs text-muted-foreground" data-testid="text-review-date">
              {format(date, "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm" data-testid="text-review-comment">{comment}</p>
    </Card>
  )
}
