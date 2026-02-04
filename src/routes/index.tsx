import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Verse</h1>
        <p className="text-muted-foreground">Modern Kodi Web Interface</p>
      </header>
      <main>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold">Welcome to Verse</h2>
          <p className="mb-4">Phase 1: Movies & TV Shows - Implementation in progress</p>

          {/* Quick Navigation */}
          <div className="mb-6 flex gap-3">
            <Link to="/movies">
              <Button size="lg" className="gap-2">
                <Film className="h-5 w-5" />
                Browse Movies
              </Button>
            </Link>
          </div>

          <ul className="list-disc space-y-2 pl-6">
            <li>React 19 + TypeScript</li>
            <li>Vite for blazing-fast development</li>
            <li>Tailwind CSS 4 for styling</li>
            <li>TanStack Query for data fetching</li>
            <li>TanStack Router for type-safe routing</li>
            <li>TanStack Virtual for performance</li>
            <li>Vitest for testing</li>
            <li>ESLint + Prettier for code quality</li>
          </ul>
          <div className="mt-6 space-y-2">
            <p className="font-semibold">Features ready to test:</p>
            <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
              <li>Movies library with virtual scrolling</li>
              <li>Search and filter movies</li>
              <li>Movie detail pages with cast</li>
              <li>Play/Resume buttons (requires Kodi running)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: HomePage,
});
