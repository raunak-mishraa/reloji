import { Card } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[#0f8c27]/5">
      <div className="container mx-auto px-4 md:px-8 py-4 md:py-6">
        {/* Header Skeleton */}
        <Card className="mb-4">
          <div className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </Card>

        {/* Messages Container Skeleton */}
        <Card className="h-[calc(100vh-16rem)] md:h-[calc(100vh-14rem)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Left message */}
            <div className="flex items-end gap-2">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="max-w-[75%] sm:max-w-md p-3 rounded-2xl bg-muted animate-pulse h-16 w-48" />
            </div>
            
            {/* Right message */}
            <div className="flex items-end gap-2 justify-end">
              <div className="max-w-[75%] sm:max-w-md p-3 rounded-2xl bg-muted animate-pulse h-16 w-56" />
            </div>
            
            {/* Left message */}
            <div className="flex items-end gap-2">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="max-w-[75%] sm:max-w-md p-3 rounded-2xl bg-muted animate-pulse h-20 w-64" />
            </div>
            
            {/* Right message */}
            <div className="flex items-end gap-2 justify-end">
              <div className="max-w-[75%] sm:max-w-md p-3 rounded-2xl bg-muted animate-pulse h-12 w-40" />
            </div>
            
            {/* Left message */}
            <div className="flex items-end gap-2">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="max-w-[75%] sm:max-w-md p-3 rounded-2xl bg-muted animate-pulse h-16 w-52" />
            </div>
          </div>

          {/* Input Area Skeleton */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-10 bg-muted rounded-md animate-pulse" />
              <div className="h-10 w-10 bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
