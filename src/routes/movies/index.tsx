import { createFileRoute } from '@tanstack/react-router';
import { MovieList } from '@/features/movies/components/MovieList';

function MoviesListPage() {
  return <MovieList />;
}

export const Route = createFileRoute('/movies/')({
  component: MoviesListPage,
});
