import React from 'react';
import type { Email } from '../../types/Email';
import { formatDateTime } from '../../utils/formatDate';
import { Calendar } from 'lucide-react';
import { CategoryTag } from '../common/CategoryTag';
import { useNavigate } from 'react-router-dom';

interface DeadlineCardProps {
  email: Email;
}

export const DeadlineCard: React.FC<DeadlineCardProps> = ({ email }) => {
  const navigate = useNavigate();

  const deadlineDate = email.deadlineDetected ? new Date(email.deadlineDetected) : null;
  const now = new Date();
  const daysUntil = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isUrgent = daysUntil !== null && daysUntil <= 2;

  return (
    <div
      onClick={() => navigate(`/inbox?emailId=${email.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        background: 'var(--s1)',
        border: `1px solid ${isUrgent ? 'rgba(240,80,80,0.30)' : 'var(--border)'}`,
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'var(--s2)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-b)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'var(--s1)';
        (e.currentTarget as HTMLElement).style.borderColor = isUrgent ? 'rgba(240,80,80,0.30)' : 'var(--border)';
      }}
    >
      {/* Calendar icon */}
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 6,
          background: isUrgent ? 'rgba(240,80,80,0.12)' : 'rgba(240,192,48,0.10)',
          border: `1px solid ${isUrgent ? 'rgba(240,80,80,0.25)' : 'rgba(240,192,48,0.20)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Calendar size={12} style={{ color: isUrgent ? '#f05050' : '#f0c030' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {email.subject}
        </p>
        {email.deadlineDetected && (
          <p style={{ fontSize: 9, color: '#f0c030', margin: 0, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
            {daysUntil !== null && daysUntil <= 0
              ? 'Due today!'
              : daysUntil === 1
              ? 'Due tomorrow'
              : formatDateTime(email.deadlineDetected)}
          </p>
        )}
      </div>

      <CategoryTag category={email.category} />
    </div>
  );
};
