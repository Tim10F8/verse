import { useMutation, useQuery, type UseMutationOptions } from '@tanstack/react-query';
import { kodi } from '@/api/client';
import type {
  PlayOptions,
  GetActivePlayersResponse,
  GetPlayerPropertiesResponse,
} from '@/api/types/player';
import { PLAYER_PROPERTIES } from '@/api/types/player';

/**
 * Hook to play a movie or episode
 */
export function usePlay(options?: UseMutationOptions<string, Error, PlayOptions>) {
  return useMutation({
    mutationFn: async (playOptions: PlayOptions) => {
      const response = await kodi.call<string>('Player.Open', {
        item: playOptions.item,
        options: playOptions.options,
      });
      return response;
    },
    ...options,
  });
}

/**
 * Hook to get active players
 */
export function useActivePlayers() {
  return useQuery({
    queryKey: ['player', 'active'],
    queryFn: async () => {
      const response = await kodi.call<GetActivePlayersResponse[]>('Player.GetActivePlayers');
      return response;
    },
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 1000,
  });
}

/**
 * Hook to get player properties
 */
export function usePlayerProperties(playerId: number | undefined) {
  return useQuery({
    queryKey: ['player', 'properties', playerId],
    queryFn: async () => {
      if (playerId === undefined) {
        throw new Error('Player ID is required');
      }

      const response = await kodi.call<GetPlayerPropertiesResponse>(
        'Player.GetProperties',
        {
          playerid: playerId,
          properties: PLAYER_PROPERTIES,
        }
      );
      return response;
    },
    enabled: playerId !== undefined,
    refetchInterval: 1000, // Update every second
    staleTime: 500,
  });
}

/**
 * Hook to stop playback
 */
export function useStop(options?: UseMutationOptions<string, Error, number>) {
  return useMutation({
    mutationFn: async (playerId: number) => {
      const response = await kodi.call<string>('Player.Stop', {
        playerid: playerId,
      });
      return response;
    },
    ...options,
  });
}

/**
 * Hook to pause/resume playback
 */
export function usePlayPause(options?: UseMutationOptions<string, Error, number>) {
  return useMutation({
    mutationFn: async (playerId: number) => {
      const response = await kodi.call<string>('Player.PlayPause', {
        playerid: playerId,
      });
      return response;
    },
    ...options,
  });
}

/**
 * Hook to seek in playback
 */
export function useSeek(
  options?: UseMutationOptions<string, Error, { playerId: number; value: number }>
) {
  return useMutation({
    mutationFn: async ({ playerId, value }) => {
      const response = await kodi.call<string>('Player.Seek', {
        playerid: playerId,
        value: { percentage: value },
      });
      return response;
    },
    ...options,
  });
}
