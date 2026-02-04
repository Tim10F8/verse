import { Card, CardContent } from '@/components/ui/card';
import { MediaImage } from '@/components/media/MediaImage';
import type { KodiCast } from '@/api/types/common';
import { getImageUrl } from '@/lib/image-utils';

interface MovieCastProps {
  cast: KodiCast[];
  maxItems?: number;
}

export function MovieCast({ cast, maxItems = 12 }: MovieCastProps) {
  if (!cast || cast.length === 0) {
    return null;
  }

  const displayCast = maxItems ? cast.slice(0, maxItems) : cast;

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Cast</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {displayCast.map((member, index) => (
          <Card key={`${member.name}-${index}`} className="overflow-hidden">
            <CardContent className="p-0">
              <MediaImage
                src={getImageUrl(member.thumbnail)}
                alt={member.name}
                aspectRatio="poster"
                placeholderType="thumb"
              />
              <div className="p-3">
                <p className="text-sm font-medium leading-tight">{member.name}</p>
                {member.role && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{member.role}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
