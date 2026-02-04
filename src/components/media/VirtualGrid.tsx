import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';

interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columnCount?: number;
  estimateSize?: number;
  overscan?: number;
  className?: string;
  gap?: number;
}

export function VirtualGrid<T>({
  items,
  renderItem,
  columnCount = 5,
  estimateSize = 320,
  overscan = 2,
  className,
  gap = 16,
}: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate rows based on items and columns
  const rowCount = Math.ceil(items.length / columnCount);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={cn('h-full w-full overflow-auto', className)}
      style={{
        contain: 'strict',
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const startIndex = virtualRow.index * columnCount;
          const rowItems = items.slice(startIndex, startIndex + columnCount);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                  gap: `${gap}px`,
                }}
              >
                {rowItems.map((item, itemIndex) => (
                  <div key={startIndex + itemIndex}>{renderItem(item, startIndex + itemIndex)}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Responsive column count hook
export function useResponsiveColumns() {
  // This could be enhanced with useMediaQuery hook
  // For now, return a static value that works well
  // Mobile: 2, Tablet: 3, Desktop: 5, Large: 6
  return {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6,
  };
}
