import { useState, useEffect } from 'react';

/**
 * Hook that returns a blur amount (0-1) based on scroll position.
 * The blur eases in as the user scrolls down, reaching max at the specified threshold.
 * @param thresholdVh - Threshold as a percentage of viewport height (default: 50 for 50vh)
 */
export function useScrollBlur(thresholdVh = 50): number {
  const [blurAmount, setBlurAmount] = useState(0);

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');

    if (!scrollContainer) {
      return;
    }

    const onScroll = () => {
      const scrollY = scrollContainer.scrollTop;
      const threshold = (window.innerHeight * thresholdVh) / 100;

      // Calculate blur amount (0 to 1) with easing
      const rawProgress = Math.min(scrollY / threshold, 1);
      // Apply ease-out curve for smoother feel
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
      setBlurAmount(easedProgress);
    };

    scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll(); // Initial check

    return () => {
      scrollContainer.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [thresholdVh]);

  return blurAmount;
}
