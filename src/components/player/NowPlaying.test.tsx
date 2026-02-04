/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import { NowPlaying } from './NowPlaying';
import userEvent from '@testing-library/user-event';
import * as playbackHooks from '@/api/hooks/usePlayback';

// Mock the playback hooks
vi.mock('@/api/hooks/usePlayback', () => ({
  useActivePlayers: vi.fn(),
  usePlayerProperties: vi.fn(),
  usePlayPause: vi.fn(),
  useStop: vi.fn(),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('NowPlaying', () => {
  const mockPlayPauseMutate = vi.fn();
  const mockStopMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(playbackHooks.usePlayPause).mockReturnValue({
      mutate: mockPlayPauseMutate,
      isPending: false,
    } as any);

    vi.mocked(playbackHooks.useStop).mockReturnValue({
      mutate: mockStopMutate,
      isPending: false,
    } as any);
  });

  it('returns null when no active player', () => {
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: undefined,
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: undefined,
    } as any);

    const { container } = render(<NowPlaying />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when no player properties', () => {
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: [{ playerid: 1, type: 'video' }],
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: undefined,
    } as any);

    const { container } = render(<NowPlaying />);
    expect(container.firstChild).toBeNull();
  });

  it('renders playing state correctly', () => {
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: [{ playerid: 1, type: 'video' }],
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: {
        speed: 1,
        percentage: 50,
        time: { hours: 0, minutes: 30, seconds: 15 },
        totaltime: { hours: 1, minutes: 0, seconds: 30 },
      },
    } as any);

    render(<NowPlaying />);

    expect(screen.getByText('Playing Video')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    expect(screen.getByText(/30:15/)).toBeInTheDocument();
    expect(screen.getByText(/1:00:30/)).toBeInTheDocument();
  });

  it('renders paused state correctly', () => {
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: [{ playerid: 1, type: 'video' }],
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: {
        speed: 0,
        percentage: 25,
        time: { hours: 0, minutes: 15, seconds: 0 },
        totaltime: { hours: 1, minutes: 0, seconds: 0 },
      },
    } as any);

    render(<NowPlaying />);

    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  });

  it('handles play/pause button click', async () => {
    const user = userEvent.setup();
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: [{ playerid: 1, type: 'video' }],
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: {
        speed: 1,
        percentage: 50,
        time: { hours: 0, minutes: 30, seconds: 0 },
        totaltime: { hours: 1, minutes: 0, seconds: 0 },
      },
    } as any);

    render(<NowPlaying />);

    const playPauseButton = screen.getByRole('button', { name: 'Pause' });
    await user.click(playPauseButton);

    expect(mockPlayPauseMutate).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        onError: expect.any(Function),
      })
    );
  });

  it('handles stop button click', async () => {
    const user = userEvent.setup();
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: [{ playerid: 1, type: 'video' }],
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: {
        speed: 1,
        percentage: 50,
        time: { hours: 0, minutes: 30, seconds: 0 },
        totaltime: { hours: 1, minutes: 0, seconds: 0 },
      },
    } as any);

    render(<NowPlaying />);

    const stopButton = screen.getByRole('button', { name: 'Stop' });
    await user.click(stopButton);

    expect(mockStopMutate).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        onError: expect.any(Function),
      })
    );
  });

  it('disables buttons when mutations are pending', () => {
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: [{ playerid: 1, type: 'video' }],
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: {
        speed: 1,
        percentage: 50,
        time: { hours: 0, minutes: 0, seconds: 0 },
        totaltime: { hours: 1, minutes: 0, seconds: 0 },
      },
    } as any);
    vi.mocked(playbackHooks.usePlayPause).mockReturnValue({
      mutate: mockPlayPauseMutate,
      isPending: true,
    } as any);
    vi.mocked(playbackHooks.useStop).mockReturnValue({
      mutate: mockStopMutate,
      isPending: true,
    } as any);

    render(<NowPlaying />);

    const playPauseButton = screen.getByRole('button', { name: 'Pause' });
    const stopButton = screen.getByRole('button', { name: 'Stop' });

    expect(playPauseButton).toBeDisabled();
    expect(stopButton).toBeDisabled();
  });

  it('formats time with hours correctly', () => {
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: [{ playerid: 1, type: 'video' }],
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: {
        speed: 1,
        percentage: 50,
        time: { hours: 1, minutes: 30, seconds: 45 },
        totaltime: { hours: 2, minutes: 15, seconds: 30 },
      },
    } as any);

    render(<NowPlaying />);

    expect(screen.getByText(/1:30:45/)).toBeInTheDocument();
    expect(screen.getByText(/2:15:30/)).toBeInTheDocument();
  });

  it('formats time without hours correctly', () => {
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: [{ playerid: 1, type: 'video' }],
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: {
        speed: 1,
        percentage: 50,
        time: { hours: 0, minutes: 5, seconds: 30 },
        totaltime: { hours: 0, minutes: 10, seconds: 0 },
      },
    } as any);

    render(<NowPlaying />);

    expect(screen.getByText(/5:30/)).toBeInTheDocument();
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
  });

  it('displays audio player type', () => {
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: [{ playerid: 1, type: 'audio' }],
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: {
        speed: 1,
        percentage: 50,
        time: { hours: 0, minutes: 2, seconds: 30 },
        totaltime: { hours: 0, minutes: 5, seconds: 0 },
      },
    } as any);

    render(<NowPlaying />);

    expect(screen.getByText('Playing Audio')).toBeInTheDocument();
  });

  it('displays progress bar with correct percentage', () => {
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: [{ playerid: 1, type: 'video' }],
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: {
        speed: 1,
        percentage: 75,
        time: { hours: 0, minutes: 45, seconds: 0 },
        totaltime: { hours: 1, minutes: 0, seconds: 0 },
      },
    } as any);

    const { container } = render(<NowPlaying />);

    const progressBar = container.querySelector('.bg-primary');
    expect(progressBar).toHaveStyle({ width: '75%' });
  });

  it('handles zero percentage', () => {
    vi.mocked(playbackHooks.useActivePlayers).mockReturnValue({
      data: [{ playerid: 1, type: 'video' }],
    } as any);
    vi.mocked(playbackHooks.usePlayerProperties).mockReturnValue({
      data: {
        speed: 1,
        percentage: 0,
        time: { hours: 0, minutes: 0, seconds: 0 },
        totaltime: { hours: 1, minutes: 0, seconds: 0 },
      },
    } as any);

    const { container } = render(<NowPlaying />);

    const progressBar = container.querySelector('.bg-primary');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });
});
