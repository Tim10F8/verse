import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value?: number;
  isLoading?: boolean;
}

export function StatsCard({ icon: Icon, label, value, isLoading }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="bg-primary/10 rounded-lg p-3">
          <Icon className="text-primary h-6 w-6" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          {isLoading ? (
            <Skeleton className="mt-1 h-7 w-16" />
          ) : (
            <p className="text-2xl font-bold">{value?.toLocaleString() ?? 0}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsGridProps {
  children: React.ReactNode;
}

export function StatsGrid({ children }: StatsGridProps) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{children}</div>;
}
