import { useState, useEffect } from 'react';

export interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useViewport(): ViewportState {
  const [viewport, setViewport] = useState<ViewportState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1280,
      isDesktop: width >= 1280,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1280,
        isDesktop: width >= 1280,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}
