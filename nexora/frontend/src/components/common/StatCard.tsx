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
 * Gmail/Material style flat StatCard
 */
export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, accentColor, icon: Icon }) => {
  return (
    <div
      className="surface-elevated"
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        borderLeft: `4px solid ${accentColor}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="section-label">{label}</span>
        <Icon size={18} style={{ color: accentColor }} />
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: 'var(--text-1)',
          lineHeight: 1,
          fontFamily: 'Google Sans, Roboto, sans-serif',
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
          {sub}
        </div>
      )}
    </div>
  );
};
