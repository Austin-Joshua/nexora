import React from 'react';
import { CAT_COLORS } from '../../utils/catColors';

interface CategoryTagProps {
  category: string;
}

/**
 * Terminal-style monospace category tag.
 * Uses the CAT_COLORS map for color and abbreviated label.
 */
export const CategoryTag: React.FC<CategoryTagProps> = ({ category }) => {
  const cfg = CAT_COLORS[category] ?? { label: category.slice(0, 5).toUpperCase(), color: '#3d5570' };
  return (
    <span
      style={{
        background: cfg.color + '18',
        color: cfg.color,
        border: `1px solid ${cfg.color}28`,
        padding: '1px 5px',
        borderRadius: 3,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.10em',
        fontFamily: 'JetBrains Mono, monospace',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {cfg.label}
    </span>
  );
};
