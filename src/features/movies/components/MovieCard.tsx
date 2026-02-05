import { Link } from '@tanstack/react-router';
import { MediaPoster } from '@/components/media/MediaPoster';
import { WatchedIndicator } from '@/components/video/WatchedIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { KodiMovie } from '@/api/types/video';
import { formatYear, formatRating } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: KodiMovie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const year = formatYear(movie.year || movie.premiered);
  const rating = movie.rating ? formatRating(movie.rating) : null;

  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId: movie.movieid.toString() }}
      className={cn('group block w-full', className)}
    >
      <Card className="overflow-hidden border-0 bg-transparent shadow-none transition-transform duration-300 hover:scale-105">
        <CardContent className="p-0">
          <div className="relative">
            <MediaPoster art={movie.art} title={movie.title} />

            {/* Watched indicator */}
            <div className="absolute top-2 right-2">
              <WatchedIndicator playcount={movie.playcount} resume={movie.resume} variant="icon" />
            </div>

            {/* Rating badge */}
            {rating && (
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm">
                  <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {rating}
                </Badge>
              </div>
            )}
          </div>

          <div className="mt-2 space-y-1 px-1">
            <h3 className="group-hover:text-primary line-clamp-2 leading-tight font-semibold">
              {movie.title}
            </h3>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              {year && <span>{year}</span>}
              {movie.genre && movie.genre.length > 0 && (
                <>
                  <span>•</span>
                  <span className="truncate">{movie.genre[0]}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
