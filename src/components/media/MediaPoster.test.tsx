import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { MediaPoster } from './MediaPoster';
import type { KodiArt } from '@/api/types/common';

describe('MediaPoster', () => {
  it('renders with title', () => {
    render(<MediaPoster title="Test Movie" />);
    const image = screen.getByAltText('Test Movie');
    expect(image).toBeInTheDocument();
  });

  it('uses poster from art object', () => {
    const art: KodiArt = {
      poster: 'image://poster-path/',
    };
    render(<MediaPoster art={art} title="Test Movie" />);

    const image = screen.getByAltText('Test Movie');
    expect(image).toBeInTheDocument();
  });

  it('falls back to thumb when no poster', () => {
    const art: KodiArt = {
      thumb: 'image://thumb-path/',
    };
    render(<MediaPoster art={art} title="Test Movie" />);

    const image = screen.getByAltText('Test Movie');
    expect(image).toBeInTheDocument();
  });

  it('renders without art object', () => {
    render(<MediaPoster title="Test Movie" />);
    const image = screen.getByAltText('Test Movie');
    expect(image).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<MediaPoster title="Test Movie" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('supports lazy loading by default', () => {
    render(<MediaPoster title="Test Movie" />);
    const image = screen.getByAltText('Test Movie');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('supports eager loading', () => {
    render(<MediaPoster title="Test Movie" loading="eager" />);
    const image = screen.getByAltText('Test Movie');
    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('renders hover overlay', () => {
    const { container } = render(<MediaPoster title="Test Movie" />);
    const overlay = container.querySelector('.bg-gradient-to-t');
    expect(overlay).toBeInTheDocument();
  });
});
