import { createFileRoute } from '@tanstack/react-router';

function TVShows() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">TV Shows</h1>
      <p className="text-muted-foreground">TV Shows feature coming soon...</p>
    </div>
  );
}

export const Route = createFileRoute('/tv/')({
  component: TVShows,
});
