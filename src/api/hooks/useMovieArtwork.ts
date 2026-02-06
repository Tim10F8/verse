import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kodi } from '@/api/client';
import { toast } from 'sonner';

interface UpdateMovieArtworkParams {
  movieId: number;
  artworkType: string;
  url: string;
}

/**
 * Hook to update movie artwork via Kodi's VideoLibrary.SetMovieDetails
 */
export function useUpdateMovieArtwork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieId, artworkType, url }: UpdateMovieArtworkParams) => {
      // Kodi expects the art object with the specific artwork type
      await kodi.call('VideoLibrary.SetMovieDetails', {
        movieid: movieId,
        art: { [artworkType]: url },
      });
    },
    onSuccess: (_data, variables) => {
      // Invalidate the movie query to refresh the UI
      void queryClient.invalidateQueries({ queryKey: ['movie', variables.movieId] });

      toast.success('Artwork Updated', {
        description: 'The artwork has been saved successfully.',
      });
    },
    onError: (error) => {
      toast.error('Update Failed', {
        description: error instanceof Error ? error.message : 'Failed to update artwork',
      });
    },
  });
}

interface UpdateTVShowArtworkParams {
  tvshowId: number;
  artworkType: string;
  url: string;
}

/**
 * Hook to update TV show artwork via Kodi's VideoLibrary.SetTVShowDetails
 */
export function useUpdateTVShowArtwork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tvshowId, artworkType, url }: UpdateTVShowArtworkParams) => {
      await kodi.call('VideoLibrary.SetTVShowDetails', {
        tvshowid: tvshowId,
        art: { [artworkType]: url },
      });
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['tvshow', variables.tvshowId] });

      toast.success('Artwork Updated', {
        description: 'The artwork has been saved successfully.',
      });
    },
    onError: (error) => {
      toast.error('Update Failed', {
        description: error instanceof Error ? error.message : 'Failed to update artwork',
      });
    },
  });
}
