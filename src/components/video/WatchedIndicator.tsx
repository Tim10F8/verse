import { Check, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { KodiResume } from '@/api/types/common';

interface WatchedIndicatorProps {
  playcount?: number;
  resume?: KodiResume;
  className?: string;
  variant?: 'badge' | 'icon' | 'progress';
}

export function WatchedIndicator({
  playcount = 0,
  resume,
  className,
  variant = 'badge',
}: WatchedIndicatorProps) {
  const isWatched = playcount > 0;
  const hasResume = resume && resume.position > 0 && resume.total > 0;
  const percentage = hasResume ? (resume.position / resume.total) * 100 : 0;

  if (!isWatched && !hasResume) {
    return null;
  }

  if (variant === 'icon') {
    return (
      <div className={cn('rounded-full bg-primary p-1', className)}>
        {isWatched ? (
          <Check className="h-3 w-3 text-primary-foreground" />
        ) : (
          <Eye className="h-3 w-3 text-primary-foreground" />
        )}
      </div>
    );
  }

  if (variant === 'progress' && hasResume) {
    return (
      <div className={cn('space-y-1', className)}>
        <Progress value={percentage} className="h-1" />
        <p className="text-xs text-muted-foreground">{Math.round(percentage)}% watched</p>
      </div>
    );
  }

  return (
    <Badge variant={isWatched ? 'default' : 'secondary'} className={cn('gap-1', className)}>
      {isWatched ? (
        <>
          <Check className="h-3 w-3" />
          Watched
        </>
      ) : (
        <>
          <Eye className="h-3 w-3" />
          {Math.round(percentage)}%
        </>
      )}
    </Badge>
  );
}
