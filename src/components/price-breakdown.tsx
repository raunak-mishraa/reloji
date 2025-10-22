import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PriceBreakdownProps {
  pricePerDay: number
  days: number
  depositAmount: number
  serviceFee?: number
}

export function PriceBreakdown({ pricePerDay, days, depositAmount, serviceFee = 0 }: PriceBreakdownProps) {
  const rentalFee = pricePerDay * days
  const total = rentalFee + serviceFee

  return (
    <Card className="p-4 space-y-3" data-testid="card-price-breakdown">
      <h3 className="font-semibold">Price Breakdown</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground" data-testid="text-rental-label">
            ₹{pricePerDay} × {days} {days === 1 ? "day" : "days"}
          </span>
          <span data-testid="text-rental-amount">₹{rentalFee}</span>
        </div>
        
        {serviceFee > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service fee</span>
            <span data-testid="text-service-fee">₹{serviceFee}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Refundable deposit</span>
          <span data-testid="text-deposit">₹{depositAmount}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span data-testid="text-total">₹{total}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Due now (incl. deposit)</span>
          <span data-testid="text-due-now">₹{total + depositAmount}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Your deposit of ₹{depositAmount} will be refunded after the item is returned in good condition.
      </p>
    </Card>
  )
}
