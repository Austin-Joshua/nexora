import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  accentColor: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, accentColor, icon: Icon, onClick }) => {
  return (
    <div
      className="card-paper"
      onClick={onClick}
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        borderLeft: `4px solid ${accentColor}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--transition-spring)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="section-label">{label}</span>
        <Icon size={18} style={{ color: accentColor }} />
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
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
