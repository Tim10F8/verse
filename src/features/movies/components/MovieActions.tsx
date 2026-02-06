import { PlayButton } from '@/components/video/PlayButton';
import { ResumeButton } from '@/components/video/ResumeButton';
import { Button } from '@/components/ui/button';
import { usePlay, useSetMovieWatched } from '@/api/hooks/usePlayback';
import type { KodiMovie } from '@/api/types/video';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

interface MovieActionsProps {
  movie: KodiMovie;
  compact?: boolean;
}

export function MovieActions({ movie, compact = false }: MovieActionsProps) {
  const playMutation = usePlay();
  const setWatchedMutation = useSetMovieWatched();

  const handlePlay = async (resume: boolean = false) => {
    try {
      await playMutation.mutateAsync({
        item: { movieid: movie.movieid },
        options: { resume },
      });

      toast.success('Playing', {
        description: `Now playing: ${movie.title}`,
      });
    } catch (error) {
      toast.error('Playback Error', {
        description: error instanceof Error ? error.message : 'Failed to start playback',
      });
    }
  };

  const hasResume = movie.resume && movie.resume.position > 0;
  const isWatched = movie.playcount !== undefined && movie.playcount > 0;

  const handleToggleWatched = () => {
    setWatchedMutation.mutate({
      movieid: movie.movieid,
      playcount: isWatched ? 0 : 1,
    });
  };

  // Compact mode: just the play button for the hero section
  if (compact) {
    return (
      <div className="flex gap-2">
        <PlayButton onClick={() => void handlePlay(false)} disabled={playMutation.isPending} />
        {hasResume && movie.resume && (
          <ResumeButton
            resume={movie.resume}
            onClick={() => void handlePlay(true)}
            disabled={playMutation.isPending}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <PlayButton
        onClick={() => void handlePlay(false)}
        disabled={playMutation.isPending}
        size="lg"
      />

      {hasResume && movie.resume && (
        <ResumeButton
          resume={movie.resume}
          onClick={() => void handlePlay(true)}
          disabled={playMutation.isPending}
          size="lg"
        />
      )}

      <Button
        variant="outline"
        size="lg"
        onClick={handleToggleWatched}
        disabled={setWatchedMutation.isPending}
        className="gap-2"
      >
        {isWatched ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        {isWatched ? 'Mark Unwatched' : 'Mark Watched'}
      </Button>
    </div>
  );
}
