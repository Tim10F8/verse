import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MediaCardSkeletonProps {
  className?: string;
}

export function MediaCardSkeleton({ className }: MediaCardSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

interface MediaCardSkeletonGridProps {
  count?: number;
  className?: string;
}

export function MediaCardSkeletonGrid({ count = 20, className }: MediaCardSkeletonGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}
