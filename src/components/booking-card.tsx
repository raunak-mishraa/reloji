import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookingStatusBadge } from "@/components/booking-status-badge"
import { Calendar, DollarSign } from "lucide-react"
import { format } from "date-fns"

type BookingStatus = "pending" | "approved" | "active" | "returned" | "completed" | "cancelled" | "dispute"

interface BookingCardProps {
  id: string
  itemTitle: string
  itemImage: string
  startDate: Date
  endDate: Date
  totalAmount: number
  depositHeld: number
  status: BookingStatus
  ownerName?: string
  borrowerName?: string
  isOwner?: boolean
}

export function BookingCard({
  itemTitle,
  itemImage,
  startDate,
  endDate,
  totalAmount,
  depositHeld,
  status,
  ownerName,
  borrowerName,
  isOwner = false,
}: BookingCardProps) {
  return (
    <Card className="overflow-hidden" data-testid="card-booking">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="w-full sm:w-32 h-32 flex-shrink-0">
          <img
            src={itemImage}
            alt={itemTitle}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-base" data-testid="text-booking-title">
                {itemTitle}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isOwner ? `Borrower: ₹{borrowerName}` : `Owner: ₹{ownerName}`}
              </p>
            </div>
            <BookingStatusBadge status={status} />
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span data-testid="text-booking-dates">
                {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span data-testid="text-booking-amount">₹{totalAmount}</span>
              <span className="text-muted-foreground">(+₹{depositHeld} deposit)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {status === "pending" && isOwner && (
              <>
                <Button size="sm" variant="default" data-testid="button-approve">
                  Approve
                </Button>
                <Button size="sm" variant="outline" data-testid="button-decline">
                  Decline
                </Button>
              </>
            )}
            {status === "approved" && isOwner && (
              <Button size="sm" data-testid="button-mark-handed">
                Mark as Handed Over
              </Button>
            )}
            {status === "active" && !isOwner && (
              <Button size="sm" data-testid="button-mark-returned">
                Mark as Returned
              </Button>
            )}
            {status === "returned" && isOwner && (
              <>
                <Button size="sm" data-testid="button-confirm-return">
                  Confirm Return
                </Button>
                <Button size="sm" variant="destructive" data-testid="button-dispute">
                  Report Issue
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" data-testid="button-view-details">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
