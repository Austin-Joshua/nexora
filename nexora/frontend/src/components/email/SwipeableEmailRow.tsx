import React from 'react';
import type { Email } from '../../types/Email';
import { useSwipeAction } from '../../hooks/useSwipeAction';
import { Check, Star, CornerUpLeft } from 'lucide-react';

interface SwipeableEmailRowProps {
  email: Email;
  children: React.ReactNode;
  onDone?: () => void;
  onReply?: () => void;
  onStar?: () => void;
}

export const SwipeableEmailRow: React.FC<SwipeableEmailRowProps> = ({
  children,
  onDone,
  onReply,
  onStar,
}) => {
  const { translateX, onTouchStart, onTouchMove, onTouchEnd } = useSwipeAction({
    onSwipeRight: onDone,
    onSwipeLeft: onReply,
    threshold: 70,
  });

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: translateX > 0 ? 'var(--success)' : translateX < 0 ? 'var(--ember)' : 'transparent',
      }}
    >
      {/* Background action reveal indicator */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: translateX > 0 ? 'flex-start' : 'flex-end',
          padding: '0 20px',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: 13,
          gap: 8,
        }}
      >
        {translateX > 0 ? (
          <>
            <Check size={20} />
            <span>Mark Done</span>
          </>
        ) : translateX < 0 ? (
          <>
            <span>Reply / Star</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <CornerUpLeft size={18} onClick={onReply} />
              <Star size={18} onClick={onStar} />
            </div>
          </>
        ) : null}
      </div>

      {/* Row content container */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: translateX === 0 ? 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          background: 'var(--bg)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
};
