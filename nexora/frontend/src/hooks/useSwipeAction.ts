import { useState, useRef } from 'react';

interface SwipeOptions {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  threshold?: number;
}

export function useSwipeAction({
  onSwipeRight,
  onSwipeLeft,
  threshold = 80,
}: SwipeOptions) {
  const [translateX, setTranslateX] = useState(0);
  const startXRef = useRef(0);
  const isSwipingRef = useRef(false);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    isSwipingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwipingRef.current) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    // Limit maximum swipe distance
    if (Math.abs(deltaX) < 160) {
      setTranslateX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    isSwipingRef.current = false;
    if (translateX > threshold && onSwipeRight) {
      triggerHaptic();
      onSwipeRight();
    } else if (translateX < -threshold && onSwipeLeft) {
      triggerHaptic();
      onSwipeLeft();
    }
    setTranslateX(0);
  };

  return {
    translateX,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
