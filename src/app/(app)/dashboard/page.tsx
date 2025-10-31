import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyListings from "./_components/MyListings";
import MyBookings from "./_components/MyBookings";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[#0f8c27]/5">
      <div className="container mx-auto py-6 md:py-10 px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your listings and bookings</p>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            <TabsTrigger 
              value="listings" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[#0f8c27] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              My Listings
            </TabsTrigger>
            <TabsTrigger 
              value="bookings"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[#0f8c27] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              My Bookings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings" className="mt-6">
            <MyListings />
          </TabsContent>
          
          <TabsContent value="bookings" className="mt-6">
            <MyBookings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
