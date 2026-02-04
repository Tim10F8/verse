import { createFileRoute } from '@tanstack/react-router';
import { MovieDetails } from '@/features/movies/components/MovieDetails';

function MovieDetailPage() {
  return <MovieDetails />;
}

export const Route = createFileRoute('/movies/$movieId')({
  component: MovieDetailPage,
});
