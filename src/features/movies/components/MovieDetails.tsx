import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useMovieDetails } from '@/api/hooks/useMovieDetails';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MediaImage } from '@/components/media/MediaImage';
import { WatchedIndicator } from '@/components/video/WatchedIndicator';
import { MovieActions } from './MovieActions';
import { MovieMetadata } from './MovieMetadata';
import { MovieCast } from './MovieCast';
import { getFanartUrl, getPosterUrl } from '@/lib/image-utils';

export function MovieDetails() {
  const { movieId } = useParams({ strict: false }) as { movieId: string };
  const movieIdNum = parseInt(movieId, 10);

  const { data: movie, isLoading, isError, error } = useMovieDetails(movieIdNum);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="relative h-[50vh] w-full">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/movies">
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Movies
          </Button>
        </Link>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
          <h2 className="mb-2 text-lg font-semibold text-destructive">Error loading movie</h2>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Movie not found'}
          </p>
        </div>
      </div>
    );
  }

  const fanartUrl = getFanartUrl(movie.art);
  const posterUrl = getPosterUrl(movie.art);

  return (
    <div className="min-h-screen">
      {/* Backdrop with gradient overlay */}
      {fanartUrl && (
        <div className="relative h-[50vh] w-full">
          <MediaImage
            src={fanartUrl}
            alt={movie.title}
            aspectRatio="fanart"
            loading="eager"
            placeholderType="fanart"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Link to="/movies">
          <Button variant="ghost" size="sm" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Movies
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Poster */}
          <div className="mx-auto w-full max-w-[300px] lg:mx-0">
            <div className="relative">
              <MediaImage
                src={posterUrl}
                alt={movie.title}
                aspectRatio="poster"
                loading="eager"
                placeholderType="poster"
                className="w-full rounded-lg shadow-lg"
              />
              {movie.playcount !== undefined && movie.playcount > 0 && (
                <div className="absolute right-3 top-3">
                  <WatchedIndicator
                    playcount={movie.playcount}
                    resume={movie.resume}
                    variant="icon"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="mb-2 text-4xl font-bold">{movie.title}</h1>
              {movie.originaltitle && movie.originaltitle !== movie.title && (
                <p className="text-lg text-muted-foreground">{movie.originaltitle}</p>
              )}
            </div>

            {/* Actions */}
            <MovieActions movie={movie} />

            {/* Metadata */}
            <MovieMetadata movie={movie} />

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="pt-6">
                <MovieCast cast={movie.cast} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
