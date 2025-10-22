import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyListings from "./_components/MyListings";
import MyBookings from "./_components/MyBookings";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>
      <Tabs defaultValue="listings">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="listings">
          <MyListings />
        </TabsContent>
        <TabsContent value="bookings">
          <MyBookings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
