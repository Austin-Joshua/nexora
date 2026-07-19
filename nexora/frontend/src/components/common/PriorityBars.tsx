import React from 'react';

interface PriorityBarsProps {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Signature component: 3 vertical bars like a cell signal indicator.
 * Heights: 4px, 7px, 10px
 * HIGH: 3 bars red | MEDIUM: 2 bars gold | LOW: 1 bar green
 */
export const PriorityBars: React.FC<PriorityBarsProps> = ({ priority }) => {
  const filled = priority === 'HIGH' ? 3 : priority === 'MEDIUM' ? 2 : 1;
  const color  = priority === 'HIGH' ? '#f05050' : priority === 'MEDIUM' ? '#f0c030' : '#40c070';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }} title={priority}>
      {([4, 7, 10] as const).map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: h,
            background: i < filled ? color : 'var(--border)',
            borderRadius: 1,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
};
