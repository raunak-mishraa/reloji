'use client'
import { Header } from "@/components/header"
import { UserAvatar } from "@/components/user-avatar"
import { RatingDisplay } from "@/components/rating-display"
import { PriceBreakdown } from "@/components/price-breakdown"
import { ReviewCard } from "@/components/review-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Shield, Calendar, MessageCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const reviews = [
  {
    reviewerName: "Alex Chen",
    reviewerImage: "https://i.pravatar.cc/150?img=8",
    rating: 5,
    comment: "Great camera! Owner was very responsive and the equipment was in perfect condition. Would definitely rent again.",
    date: new Date("2024-01-15"),
    verified: true,
  },
  {
    reviewerName: "Maria Garcia",
    rating: 4,
    comment: "Good quality camera. Pickup was smooth and everything worked as expected. Minor scratches on the body but nothing that affected performance.",
    date: new Date("2024-01-10"),
    verified: true,
  },
  {
    reviewerName: "James Wilson",
    reviewerImage: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    comment: "Perfect for my weekend shoot. Sarah was flexible with pickup times and provided helpful tips.",
    date: new Date("2024-01-05"),
    verified: true,
  },
]

export default function ListingDetail() {
  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={false} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-[3/2] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1606980633582-4a05b14e6f1c?w=1200&h=800&fit=crop"
                alt="Canon EOS R5"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden hover-elevate cursor-pointer">
                  <img
                    src={`https://images.unsplash.com/photo-1606980633582-4a05b14e6f1c?w=300&h=300&fit=crop&q=${i}`}
                    alt={`View ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h1 className="text-3xl font-bold mb-2" data-testid="text-listing-title">
                      Professional DSLR Camera Canon EOS R5
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>San Francisco, CA</span>
                      </div>
                      <RatingDisplay rating={4.8} size="sm" />
                      <span>(24 reviews)</span>
                    </div>
                  </div>
                  <Badge variant="secondary">Photography</Badge>
                </div>
              </div>

              <Separator />

              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <UserAvatar name="Sarah Smith" image="https://i.pravatar.cc/150?img=5" size="lg" verified />
                  <div className="flex-1">
                    <h3 className="font-semibold">Sarah Smith</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Response rate: 98%</span>
                      <span>•</span>
                      <span>27 rentals</span>
                    </div>
                  </div>
                  <Button variant="outline" data-testid="button-message-owner">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </Card>

              <Tabs defaultValue="description" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">About this item</h3>
                    <p className="text-muted-foreground">
                      Professional full-frame mirrorless camera perfect for photography and videography. Comes with two batteries, charger, memory cards, and camera bag. Great for events, portraits, and commercial work.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">What's included</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Canon EOS R5 body</li>
                      <li>24-70mm f/2.8 lens</li>
                      <li>2× batteries + charger</li>
                      <li>64GB memory cards</li>
                      <li>Camera bag</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Rental rules</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Please handle with care</li>
                      <li>Return fully charged</li>
                      <li>No cancellations within 24 hours</li>
                      <li>Insurance recommended for outdoor use</li>
                    </ul>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Protected by BorrowHub</p>
                      <p className="text-muted-foreground">
                        All rentals are covered by our protection plan. Your deposit is held securely and refunded after safe return.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl font-bold">4.8</div>
                      <RatingDisplay rating={4.8} showNumber={false} />
                      <div className="text-sm text-muted-foreground mt-1">24 reviews</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm w-8">{stars}★</span>
                          <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${stars === 5 ? 80 : stars === 4 ? 15 : 5}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {stars === 5 ? 19 : stars === 4 ? 4 : 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review, i) => (
                      <ReviewCard key={i} {...review} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="location">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p>Map view placeholder</p>
                      <p className="text-sm">San Francisco, CA</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 space-y-6 sticky top-24">
              <div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">$45</span>
                  <span className="text-muted-foreground">/ day</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rental period</label>
                    <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-select-dates">
                      <Calendar className="h-4 w-4" />
                      Select dates
                    </Button>
                  </div>
                </div>
              </div>

              <PriceBreakdown
                pricePerDay={45}
                days={3}
                depositAmount={200}
                serviceFee={15}
              />

              <Button className="w-full" size="lg" data-testid="button-request-booking">
                Request to Borrow
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                You won't be charged until the owner approves your request
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
