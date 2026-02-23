import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProblemCardSkeleton() {
  return (
    <Card className="border-l-4 border-l-muted">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <Skeleton className="h-5 flex-1 max-w-[70%]" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </CardHeader>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <Skeleton className="h-4 w-14" />
      </CardFooter>
    </Card>
  );
}
