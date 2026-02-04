import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getPlaceholderUrl } from '@/lib/image-utils';

interface MediaImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: 'poster' | 'fanart' | 'square' | 'video';
  loading?: 'lazy' | 'eager';
  onError?: () => void;
  placeholderType?: 'poster' | 'fanart' | 'thumb';
}

const aspectRatioClasses = {
  poster: 'aspect-[2/3]',
  fanart: 'aspect-video',
  square: 'aspect-square',
  video: 'aspect-video',
};

export function MediaImage({
  src,
  alt,
  className,
  aspectRatio = 'poster',
  loading = 'lazy',
  onError,
  placeholderType = 'poster',
}: MediaImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const showPlaceholder = !src || imageError;
  const imageSrc = showPlaceholder ? getPlaceholderUrl(placeholderType) : src;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-muted',
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {isLoading && !showPlaceholder && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          isLoading && !showPlaceholder ? 'opacity-0' : 'opacity-100'
        )}
      />
    </div>
  );
}
