import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { WatchedIndicator } from './WatchedIndicator';
import type { KodiResume } from '@/api/types/common';

describe('WatchedIndicator', () => {
  it('renders nothing when not watched and no resume', () => {
    const { container } = render(<WatchedIndicator playcount={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows watched badge when playcount > 0', () => {
    render(<WatchedIndicator playcount={1} variant="badge" />);
    expect(screen.getByText('Watched')).toBeInTheDocument();
  });

  it('shows in-progress badge with percentage when resume exists', () => {
    const resume: KodiResume = { position: 1800, total: 3600 };
    render(<WatchedIndicator resume={resume} variant="badge" />);

    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('icon variant shows check icon when watched', () => {
    const { container } = render(<WatchedIndicator playcount={1} variant="icon" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('icon variant shows eye icon when in progress', () => {
    const resume: KodiResume = { position: 1800, total: 3600 };
    const { container } = render(<WatchedIndicator resume={resume} variant="icon" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('progress variant shows progress bar and percentage', () => {
    const resume: KodiResume = { position: 2700, total: 3600 };
    render(<WatchedIndicator resume={resume} variant="progress" />);

    expect(screen.getByText('75% watched')).toBeInTheDocument();
  });

  it('progress variant returns null when no resume data', () => {
    const { container } = render(<WatchedIndicator variant="progress" />);
    expect(container.firstChild).toBeNull();
  });

  it('calculates percentage correctly', () => {
    const resume: KodiResume = { position: 1234, total: 5000 };
    render(<WatchedIndicator resume={resume} variant="progress" />);

    // 1234/5000 = 0.2468 = 24.68% -> rounds to 25%
    expect(screen.getByText('25% watched')).toBeInTheDocument();
  });

  it('handles zero resume position', () => {
    const resume: KodiResume = { position: 0, total: 3600 };
    const { container } = render(<WatchedIndicator resume={resume} />);

    // Should render nothing when position is 0
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(
      <WatchedIndicator playcount={1} className="custom-class" variant="badge" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('prioritizes watched over in-progress in badge variant', () => {
    const resume: KodiResume = { position: 1800, total: 3600 };
    render(<WatchedIndicator playcount={1} resume={resume} variant="badge" />);

    // Should show "Watched" not percentage when both exist
    expect(screen.getByText('Watched')).toBeInTheDocument();
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  it('handles invalid resume data gracefully', () => {
    const resume: KodiResume = { position: 100, total: 0 };
    const { container } = render(<WatchedIndicator resume={resume} />);

    // Should render nothing when total is 0
    expect(container.firstChild).toBeNull();
  });
});
