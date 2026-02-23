import { Skeleton } from "@/components/ui/skeleton";

export function ProblemDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 flex-1 max-w-[200px]" />
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
          <div className="bg-muted/40 border rounded-xl p-5 space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 max-w-[75%]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>

          <div className="flex gap-3 flex-row-reverse">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 max-w-[80%] space-y-2">
              <Skeleton className="h-4 w-full ml-auto" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </div>

          <div className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t bg-background/80 p-4">
        <div className="container max-w-3xl flex gap-2">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
}
