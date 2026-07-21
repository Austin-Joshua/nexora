import React from 'react';
import type { Priority } from '../../types/Email';

interface PriorityBarsProps {
  priority: Priority;
  size?: number;
}

export const PriorityBars: React.FC<PriorityBarsProps> = ({ priority, size = 12 }) => {
  const bars = priority === 'HIGH' ? 3 : priority === 'MEDIUM' ? 2 : 1;
  const color = priority === 'HIGH' ? 'var(--danger)' : priority === 'MEDIUM' ? 'var(--warn)' : 'var(--success)';
  const label = priority === 'HIGH' ? 'High Priority' : priority === 'MEDIUM' ? 'Medium Priority' : 'Low Priority';

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: size }}
      title={label}
    >
      {[1, 2, 3].map((b) => (
        <span
          key={b}
          style={{
            width: Math.max(3, Math.round(size / 4)),
            height: `${b * 33}%`,
            borderRadius: 1,
            backgroundColor: b <= bars ? color : 'var(--line-strong)',
            transition: 'background-color 0.15s ease',
          }}
        />
      ))}
    </div>
  );
};
