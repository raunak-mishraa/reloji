'use client'

import { Header } from "@/components/header"
import { BookingCard } from "@/components/booking-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const bookings = [
  {
    id: "1",
    itemTitle: "Professional DSLR Camera Canon EOS R5",
    itemImage: "https://images.unsplash.com/photo-1606980633582-4a05b14e6f1c?w=200&h=200&fit=crop",
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-02-18"),
    totalAmount: 135,
    depositHeld: 200,
    status: "pending" as const,
    ownerName: "Sarah Smith",
  },
  {
    id: "2",
    itemTitle: "DeWalt Power Drill Set",
    itemImage: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&h=200&fit=crop",
    startDate: new Date("2024-02-10"),
    endDate: new Date("2024-02-12"),
    totalAmount: 30,
    depositHeld: 50,
    status: "active" as const,
    ownerName: "Mike Johnson",
  },
  {
    id: "3",
    itemTitle: "Mountain Bike - Trek X-Caliber",
    itemImage: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=200&h=200&fit=crop",
    startDate: new Date("2024-01-20"),
    endDate: new Date("2024-01-23"),
    totalAmount: 75,
    depositHeld: 100,
    status: "completed" as const,
    ownerName: "Alex Chen",
  },
]

export default function MyBookings() {
  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">Pending</TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active">Active</TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} {...booking} isOwner={false} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {bookings
              .filter((b) => b.status === "pending")
              .map((booking) => (
                <BookingCard key={booking.id} {...booking} isOwner={false} />
              ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {bookings
              .filter((b) => b.status === "active")
              .map((booking) => (
                <BookingCard key={booking.id} {...booking} isOwner={false} />
              ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {bookings
              .filter((b) => b.status === "completed")
              .map((booking) => (
                <BookingCard key={booking.id} {...booking} isOwner={false} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
