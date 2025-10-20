import { Badge } from "@/components/ui/badge"

type BookingStatus = "pending" | "approved" | "active" | "returned" | "completed" | "cancelled" | "dispute"

interface BookingStatusBadgeProps {
  status: BookingStatus
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
  },
  active: {
    label: "Active",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  },
  returned: {
    label: "Returned",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
  },
  completed: {
    label: "Completed",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400",
  },
  dispute: {
    label: "Dispute",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
  },
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge className={config.className} data-testid="badge-booking-status">
      {config.label}
    </Badge>
  )
}
