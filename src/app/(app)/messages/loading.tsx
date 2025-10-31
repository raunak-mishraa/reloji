export default function Loading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <div className="mb-4 h-8 w-40 rounded bg-muted animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/5 bg-muted rounded animate-pulse" />
                <div className="h-3 w-2/5 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-2">
          <div className="h-64 md:h-96 w-full rounded-lg border bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
