import React from 'react';

interface PulseRingProps {
  active?: boolean;
  color?: 'ember' | 'violet' | 'success';
  size?: number;
  children?: React.ReactNode;
  className?: string;
}

export const PulseRing: React.FC<PulseRingProps> = ({
  active = true,
  color = 'ember',
  size = 8,
  children,
  className = '',
}) => {
  const colorHex = color === 'ember' ? 'var(--ember)' : color === 'violet' ? 'var(--violet)' : 'var(--success)';

  if (children) {
    return (
      <div style={{ position: 'relative', display: 'inline-flex' }} className={className}>
        {children}
        {active && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: colorHex,
            }}
            className="pulse-ring-active"
          />
        )}
      </div>
    );
  }

  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: colorHex,
        flexShrink: 0,
      }}
      className={`${active ? 'pulse-ring-active' : ''} ${className}`}
    />
  );
};
