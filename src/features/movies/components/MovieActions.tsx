import { PlayButton } from '@/components/video/PlayButton';
import { ResumeButton } from '@/components/video/ResumeButton';
import { usePlay } from '@/api/hooks/usePlayback';
import type { KodiMovie } from '@/api/types/video';
import { toast } from 'sonner';

interface MovieActionsProps {
  movie: KodiMovie;
}

export function MovieActions({ movie }: MovieActionsProps) {
  const playMutation = usePlay();

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

  return (
    <div className="flex flex-wrap gap-3">
      <PlayButton
        onClick={() => handlePlay(false)}
        disabled={playMutation.isPending}
        size="lg"
      />

      {hasResume && movie.resume && (
        <ResumeButton
          resume={movie.resume}
          onClick={() => handlePlay(true)}
          disabled={playMutation.isPending}
          size="lg"
        />
      )}
    </div>
  );
}
