import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  accentColor: string;
  icon: LucideIcon;
}

/**
 * Dashboard stat card with a colored top border accent.
 */
export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, accentColor, icon: Icon }) => {
  return (
    <div
      className="stat-card"
      style={{ borderTop: `2px solid ${accentColor}` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="section-label">{label}</span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: accentColor + '15',
            border: `1px solid ${accentColor}25`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={14} style={{ color: accentColor }} />
        </div>
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: 'var(--t1)',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>
          {sub}
        </div>
      )}
    </div>
  );
};
