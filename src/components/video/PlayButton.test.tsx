import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { PlayButton } from './PlayButton';
import userEvent from '@testing-library/user-event';

describe('PlayButton', () => {
  it('renders with default props', () => {
    const onClick = vi.fn();
    render(<PlayButton onClick={onClick} />);

    const button = screen.getByRole('button', { name: /play/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<PlayButton onClick={onClick} />);

    const button = screen.getByRole('button', { name: /play/i });
    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('respects disabled prop', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<PlayButton onClick={onClick} disabled />);

    const button = screen.getByRole('button', { name: /play/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('hides text when size is icon', () => {
    const onClick = vi.fn();
    render(<PlayButton onClick={onClick} size="icon" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveTextContent('Play');
  });

  it('applies custom className', () => {
    const onClick = vi.fn();
    render(<PlayButton onClick={onClick} className="custom-class" />);

    const button = screen.getByRole('button', { name: /play/i });
    expect(button).toHaveClass('custom-class');
  });

  it('supports different variants', () => {
    const onClick = vi.fn();
    const { rerender } = render(<PlayButton onClick={onClick} variant="default" />);

    let button = screen.getByRole('button', { name: /play/i });
    expect(button).toBeInTheDocument();

    rerender(<PlayButton onClick={onClick} variant="secondary" />);
    button = screen.getByRole('button', { name: /play/i });
    expect(button).toBeInTheDocument();

    rerender(<PlayButton onClick={onClick} variant="outline" />);
    button = screen.getByRole('button', { name: /play/i });
    expect(button).toBeInTheDocument();
  });

  it('supports different sizes', () => {
    const onClick = vi.fn();
    const { rerender } = render(<PlayButton onClick={onClick} size="sm" />);

    let button = screen.getByRole('button', { name: /play/i });
    expect(button).toBeInTheDocument();

    rerender(<PlayButton onClick={onClick} size="lg" />);
    button = screen.getByRole('button', { name: /play/i });
    expect(button).toBeInTheDocument();
  });
});
