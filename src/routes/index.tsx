import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Film, Tv, PlayCircle } from 'lucide-react';
import { useBreadcrumbs } from '@/components/layout/BreadcrumbContext';
import { useLibraryStats } from '@/api/hooks/useDashboard';
import { StatsCard, StatsGrid } from '@/features/dashboard/components/StatsCard';
import { ContinueWatchingRow } from '@/features/dashboard/components/ContinueWatchingRow';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { setItems } = useBreadcrumbs();
  const { data: stats, isLoading: statsLoading } = useLibraryStats();

  useEffect(() => {
    setItems([{ label: 'Home' }]);
  }, [setItems]);

  return (
    <div className="space-y-8 p-6">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Your Library</h2>
        <StatsGrid>
          <StatsCard icon={Film} label="Movies" value={stats?.movies} isLoading={statsLoading} />
          <StatsCard icon={Tv} label="TV Shows" value={stats?.tvshows} isLoading={statsLoading} />
          <StatsCard
            icon={PlayCircle}
            label="Episodes"
            value={stats?.episodes}
            isLoading={statsLoading}
          />
        </StatsGrid>
      </section>

      <ContinueWatchingRow />
    </div>
  );
}
