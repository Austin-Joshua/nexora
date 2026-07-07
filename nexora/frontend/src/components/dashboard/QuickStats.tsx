import React, { useEffect, useRef, useState } from 'react';
import { Mail, Clock, CheckSquare, TrendingUp } from 'lucide-react';

interface QuickStatsProps {
  unreadCount: number;
  upcomingDeadlines: number;
  pendingActions: number;
  categoryCounts: Record<string, number>;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<any | null>(null);

  useEffect(() => {
    if (value === 0) { setDisplayed(0); return; }
    const steps = 20;
    const inc = value / steps;
    let current = 0;
    let step = 0;
    if (ref.current) clearInterval(ref.current);
    ref.current = setInterval(() => {
      step++;
      current = Math.min(Math.round(inc * step), value);
      setDisplayed(current);
      if (current >= value && ref.current) clearInterval(ref.current);
    }, 30);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [value]);

  return <span>{displayed}</span>;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  unreadCount, upcomingDeadlines, pendingActions, categoryCounts,
}) => {
  const totalEmails = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  const stats = [
    {
      label: 'Unread Emails',
      value: unreadCount,
      icon: Mail,
      iconColor: 'text-indigo-400',
      border: 'rgba(99,102,241,0.25)',
      bg: 'rgba(99,102,241,0.08)',
      glow: 'rgba(99,102,241,0.2)',
      trend: '+12% this week',
      delay: 'delay-50',
    },
    {
      label: 'Deadlines This Week',
      value: upcomingDeadlines,
      icon: Clock,
      iconColor: 'text-red-400',
      border: 'rgba(239,68,68,0.25)',
      bg: 'rgba(239,68,68,0.08)',
      glow: 'rgba(239,68,68,0.2)',
      trend: 'Next 7 days',
      delay: 'delay-100',
    },
    {
      label: 'Pending Actions',
      value: pendingActions,
      icon: CheckSquare,
      iconColor: 'text-amber-400',
      border: 'rgba(234,179,8,0.25)',
      bg: 'rgba(234,179,8,0.08)',
      glow: 'rgba(234,179,8,0.2)',
      trend: 'Needs attention',
      delay: 'delay-150',
    },
    {
      label: 'Total Synced',
      value: totalEmails,
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      border: 'rgba(16,185,129,0.25)',
      bg: 'rgba(16,185,129,0.08)',
      glow: 'rgba(16,185,129,0.2)',
      trend: 'Across all categories',
      delay: 'delay-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, iconColor, border, bg, glow, trend, delay }) => (
        <div
          key={label}
          className={`animate-fade-in ${delay} relative rounded-2xl p-5 cursor-default group overflow-hidden transition-all duration-300 hover:-translate-y-1`}
          style={{
            background: bg,
            border: `1px solid ${border}`,
          }}
        >
          {/* Glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
            style={{ boxShadow: `inset 0 0 30px ${glow}` }}
          />
          {/* Shine effect */}
          <div
            className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${border}, transparent)` }}
          />

          <div className="relative flex items-center justify-between mb-4">
            <p className="text-xs text-slate-500 font-semibold leading-tight">{label}</p>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <Icon size={14} className={iconColor} />
            </div>
          </div>

          <p className={`text-4xl font-black ${iconColor} tracking-tight animate-number`}>
            <AnimatedNumber value={value} />
          </p>
          <p className="text-xs text-slate-600 mt-1.5 font-medium">{trend}</p>
        </div>
      ))}
    </div>
  );
};
