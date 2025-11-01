import { Card } from '@/components/ui/card';
import ListingCardSkeleton from '@/components/ListingCardSkeleton';

export default function CircleLoading() {
  return (
    <div className="min-h-screen">
      {/* Banner Skeleton */}
      <div className="h-48 md:h-64 w-full bg-muted animate-pulse" />

      <div className="container mx-auto px-4 md:px-8 -mt-24 relative z-10">
        {/* Header Card Skeleton */}
        <Card className="bg-background/95 border shadow-2xl mb-12">
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-6">
                <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-6 w-full bg-muted rounded animate-pulse" />
                <div className="flex items-center gap-8 pt-6 border-t">
                  <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="h-12 w-32 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </Card>

        {/* Listings Skeleton */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="h-8 w-1/2 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
