import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { ResumeButton } from './ResumeButton';
import userEvent from '@testing-library/user-event';
import type { KodiResume } from '@/api/types/common';

describe('ResumeButton', () => {
  const mockResume: KodiResume = {
    position: 3665, // 1:01:05
    total: 7200, // 2:00:00
  };

  it('renders with resume time', () => {
    const onClick = vi.fn();
    render(<ResumeButton resume={mockResume} onClick={onClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(/Resume/);
    expect(button).toHaveTextContent(/1:01:05/);
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ResumeButton resume={mockResume} onClick={onClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('respects disabled prop', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ResumeButton resume={mockResume} onClick={onClick} disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('formats resume position correctly', () => {
    const onClick = vi.fn();
    const resume: KodiResume = { position: 125, total: 300 };
    render(<ResumeButton resume={resume} onClick={onClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(/2:05/);
  });

  it('handles zero position', () => {
    const onClick = vi.fn();
    const resume: KodiResume = { position: 0, total: 3600 };
    render(<ResumeButton resume={resume} onClick={onClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(/0:00/);
  });

  it('applies custom className', () => {
    const onClick = vi.fn();
    render(<ResumeButton resume={mockResume} onClick={onClick} className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('supports different variants', () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <ResumeButton resume={mockResume} onClick={onClick} variant="default" />
    );

    let button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    rerender(<ResumeButton resume={mockResume} onClick={onClick} variant="outline" />);
    button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
