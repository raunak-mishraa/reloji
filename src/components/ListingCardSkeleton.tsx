import { Skeleton } from "@/components/ui/skeleton";

export default function ListingCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex items-center gap-1 pt-1">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-10" />
      </div>
      <div className="pt-2">
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}
