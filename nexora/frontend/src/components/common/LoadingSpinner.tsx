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
          border: `${b} solid rgba(99,102,241,0.2)`,
          borderTopColor: '#818cf8',
        }}
      />
      <div
        className="absolute inset-[3px] rounded-full animate-spin"
        style={{
          border: `${b} solid rgba(139,92,246,0.15)`,
          borderBottomColor: '#a78bfa',
          animationDirection: 'reverse',
          animationDuration: '0.8s',
        }}
      />
    </div>
  );
};

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-5 animate-fade-in">
      {/* Animated logo */}
      <div className="relative">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center animate-glow"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            boxShadow: '0 8px 40px rgba(99,102,241,0.4)',
          }}
        >
          <Zap size={32} className="text-white" />
        </div>
        {/* Spinning ring */}
        <div
          className="absolute -inset-2 rounded-[28px] animate-spin"
          style={{
            border: '2px solid transparent',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.4), transparent) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'destination-out',
            maskComposite: 'exclude',
            animationDuration: '2s',
          }}
        />
      </div>

      <div className="text-center">
        <p className="text-white font-bold text-lg tracking-tight">Nexora</p>
        <p className="text-slate-500 text-sm mt-0.5 animate-pulse-soft">Loading your intelligence layer…</p>
      </div>

      {/* Dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#6366f1',
              animation: `bounce-dots 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);
