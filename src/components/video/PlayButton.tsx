import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlayButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'play';
}

export function PlayButton({
  onClick,
  disabled = false,
  className,
  size = 'default',
  variant = 'play',
}: PlayButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size={size}
      variant={variant}
      className={cn('gap-2', className)}
    >
      <Play className="h-4 w-4" />
      {size !== 'icon' && 'Play'}
    </Button>
  );
}
