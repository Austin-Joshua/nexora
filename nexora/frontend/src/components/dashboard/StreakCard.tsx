import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

export const StreakCard: React.FC = () => {
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    try {
      const lastVisit = localStorage.getItem('nexora_last_visit');
      const savedStreak = parseInt(localStorage.getItem('nexora_streak') || '1', 10);
      const todayStr = new Date().toDateString();

      if (!lastVisit) {
        localStorage.setItem('nexora_last_visit', todayStr);
        localStorage.setItem('nexora_streak', '1');
        setStreak(1);
      } else if (lastVisit !== todayStr) {
        const lastDate = new Date(lastVisit);
        const todayDate = new Date(todayStr);
        const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          const newStreak = savedStreak + 1;
          localStorage.setItem('nexora_streak', newStreak.toString());
          localStorage.setItem('nexora_last_visit', todayStr);
          setStreak(newStreak);
        } else if (diffDays > 1) {
          localStorage.setItem('nexora_streak', '1');
          localStorage.setItem('nexora_last_visit', todayStr);
          setStreak(1);
        } else {
          setStreak(savedStreak);
        }
      } else {
        setStreak(savedStreak);
      }
    } catch {
      setStreak(1);
    }
  }, []);

  return (
    <div
      className="card-paper"
      style={{
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'linear-gradient(135deg, var(--paper-2), var(--ember-soft))',
        border: '1px solid rgba(26, 115, 232, 0.25)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--ember)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(26, 115, 232, 0.3)',
          flexShrink: 0,
        }}
      >
        <Flame size={24} />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--ember)', fontFamily: 'Google Sans, Roboto, sans-serif' }}>
            {streak} Day{streak > 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase' }}>
            STREAK
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-2)', margin: '2px 0 0' }}>
          Active email management streak
        </p>
      </div>
    </div>
  );
};
