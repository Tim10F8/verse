import { Card, CardContent } from '@/components/ui/card';
import { MediaImage } from '@/components/media/MediaImage';
import type { KodiCast } from '@/api/types/common';
import { getImageUrl } from '@/lib/image-utils';

interface MovieCastProps {
  cast: KodiCast[];
  maxItems?: number;
  variant?: 'default' | 'compact';
}

export function MovieCast({ cast, maxItems = 12, variant = 'default' }: MovieCastProps) {
  if (cast.length === 0) {
    return null;
  }

  const displayCast = maxItems ? cast.slice(0, maxItems) : cast;

  // Compact variant: simple list with avatar circles (like coredeck)
  if (variant === 'compact') {
    return (
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {displayCast.map((member, index) => (
          <div
            key={`${member.name}-${String(index)}`}
            className="bg-muted/50 flex items-center gap-3 rounded-md p-2"
          >
            {getImageUrl(member.thumbnail) ? (
              <img
                src={getImageUrl(member.thumbnail)}
                alt={member.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium">
                {member.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium">{member.name}</p>
              {member.role && (
                <p className="text-muted-foreground truncate text-sm">{member.role}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default variant: cards with poster images
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Cast</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {displayCast.map((member, index) => (
          <Card key={`${member.name}-${String(index)}`} className="overflow-hidden">
            <CardContent className="p-0">
              <MediaImage
                src={getImageUrl(member.thumbnail)}
                alt={member.name}
                aspectRatio="poster"
                placeholderType="thumb"
              />
              <div className="p-3">
                <p className="text-sm leading-tight font-medium">{member.name}</p>
                {member.role && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{member.role}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
