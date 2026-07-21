import React from 'react';
import { CAT_COLORS } from '../../utils/catColors';

interface CategoryTagProps {
  category: string;
}

/**
  Gmail-style label chip: 4px rounded, sans-serif, 11px font.
 */
export const CategoryTag: React.FC<CategoryTagProps> = ({ category }) => {
  const cfg = CAT_COLORS[category] ?? { label: category, color: '#64748b' };
  return (
    <span
      style={{
        background: cfg.color + '18',
        color: cfg.color,
        border: `1px solid ${cfg.color}30`,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {cfg.label}
    </span>
  );
};
