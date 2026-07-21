import React from 'react';
import type { Email } from '../../types/Email';
import { formatDateTime } from '../../utils/formatDate';
import { Calendar, AlertTriangle } from 'lucide-react';
import { CategoryTag } from '../common/CategoryTag';
import { useNavigate } from 'react-router-dom';

interface DeadlineCardProps {
  email: Email;
}

export const DeadlineCard: React.FC<DeadlineCardProps> = ({ email }) => {
  const navigate = useNavigate();

  const deadlineDate = email.deadlineDetected ? new Date(email.deadlineDetected) : null;
  const now = new Date();
  const diffMs = deadlineDate ? deadlineDate.getTime() - now.getTime() : null;
  const daysUntil = diffMs !== null ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : null;

  const isOverdue = diffMs !== null && diffMs < 0;
  const isUrgent = isOverdue || (daysUntil !== null && daysUntil <= 2);

  const getDeadlineText = () => {
    if (!deadlineDate) return '';
    if (isOverdue) {
      const days = Math.abs(daysUntil || 0);
      return days === 0 ? 'Overdue (Earlier today)' : `Overdue by ${days}d`;
    }
    if (daysUntil === 0) return 'Due Today!';
    if (daysUntil === 1) return 'Due Tomorrow';
    return `Due in ${daysUntil} days`;
  };

  return (
    <div
      onClick={() => navigate(`/inbox?emailId=${email.id}`)}
      className="surface-elevated"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        cursor: 'pointer',
        borderLeft: `4px solid ${isUrgent ? 'var(--danger)' : 'var(--star)'}`,
      }}
    >
      <div style={{ color: isUrgent ? 'var(--danger)' : 'var(--star)', flexShrink: 0 }}>
        {isOverdue ? <AlertTriangle size={16} /> : <Calendar size={16} />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {email.subject || '(no subject)'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: isUrgent ? 'var(--danger)' : 'var(--star)' }}>
            {getDeadlineText()}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>•</span>
          <span style={{ fontSize: 11, color: 'var(--text-2)' }}>
            {formatDateTime(email.deadlineDetected)}
          </span>
        </div>
      </div>

      <CategoryTag category={email.category} />
    </div>
  );
};
