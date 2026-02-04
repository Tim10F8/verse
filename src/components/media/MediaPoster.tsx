import { MediaImage } from './MediaImage';
import type { KodiArt } from '@/api/types/common';
import { getPosterUrl } from '@/lib/image-utils';
import { cn } from '@/lib/utils';

interface MediaPosterProps {
  art?: KodiArt;
  title: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function MediaPoster({ art, title, className, loading = 'lazy' }: MediaPosterProps) {
  const posterUrl = getPosterUrl(art);

  return (
    <div className={cn('group relative overflow-hidden rounded-lg', className)}>
      <MediaImage
        src={posterUrl}
        alt={title}
        aspectRatio="poster"
        loading={loading}
        placeholderType="poster"
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
