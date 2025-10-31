export default function Loading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
      </div>
      <div className="border rounded-lg p-4 space-y-4">
        {/* Messages skeleton */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/5 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
        {/* Input bar */}
        <div className="mt-4 h-10 w-full bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
