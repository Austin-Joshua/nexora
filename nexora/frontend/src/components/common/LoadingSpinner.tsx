import React from 'react';
import { Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const dims = { sm: 16, md: 32, lg: 48 };
  const border = { sm: '2px', md: '2px', lg: '3px' };
  const d = dims[size];
  const b = border[size];

  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{ width: d, height: d, position: 'relative' }}
    >
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          border: `${b} solid rgba(240,192,48,0.12)`,
          borderTopColor: '#f0c030',
        }}
      />
      <div
        className="absolute inset-[3px] rounded-full animate-spin"
        style={{
          border: `${b} solid rgba(79,158,255,0.12)`,
          borderBottomColor: '#4f9eff',
          animationDirection: 'reverse',
          animationDuration: '0.8s',
        }}
      />
    </div>
  );
};

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen" style={{ background: '#080c12' }}>
    <div className="flex flex-col items-center gap-5 animate-fade-in">
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: 'var(--s1)',
            border: '1px solid var(--border)',
          }}
        >
          <Zap size={24} style={{ color: '#f0c030' }} className="animate-pulse-soft" />
        </div>
        <div
          className="absolute -inset-1.5 rounded-[22px] animate-spin"
          style={{
            border: '2px solid transparent',
            background: 'linear-gradient(135deg, rgba(240,192,48,0.4), transparent) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'destination-out',
            maskComposite: 'exclude',
            animationDuration: '2s',
          }}
        />
      </div>

      <div className="text-center">
        <p className="font-bold text-base tracking-tight" style={{ color: 'var(--t1)' }}>Nexora</p>
        <p className="text-xs mt-1 animate-pulse-soft" style={{ color: 'var(--t3)' }}>Loading your intelligence layer…</p>
      </div>

      {/* Dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#f0c030',
              animation: `bounce-dots 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);
