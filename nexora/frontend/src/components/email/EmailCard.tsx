import React from 'react';
import type { Email } from '../../types/Email';
import { CategoryTag } from '../common/CategoryTag';
import { PriorityBars } from '../common/PriorityBars';
import { formatRelative } from '../../utils/formatDate';
import { Paperclip } from 'lucide-react';
import { useEmailStore } from '../../store/emailStore';
import { CAT_COLORS } from '../../utils/catColors';

interface EmailCardProps {
  email: Email;
  onClick?: () => void;
  isSelected?: boolean;
}

function getPriorityBorderColor(priority: string): string {
  if (priority === 'HIGH') return '#f05050';
  if (priority === 'MEDIUM') return '#f0c030';
  return 'var(--border)';
}

export const EmailCard: React.FC<EmailCardProps> = ({ email, onClick, isSelected }) => {
  const { setSelectedEmail } = useEmailStore();
  const catColor = CAT_COLORS[email.category]?.color ?? '#3d5570';
  const senderInitial = (email.senderName || email.senderEmail)[0]?.toUpperCase() ?? '?';

  const handleClick = () => {
    setSelectedEmail(email);
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className="animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 48,
        padding: '0 14px',
        borderLeft: `3px solid ${isSelected ? '#f0c030' : getPriorityBorderColor(email.priority)}`,
        borderBottom: '1px solid var(--border)',
        background: isSelected ? 'var(--s1)' : !email.isRead ? '#0b1219' : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--s1)';
      }}
      onMouseLeave={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = !email.isRead ? '#0b1219' : 'transparent';
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: catColor + '22',
          border: `1px solid ${catColor}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 800,
          color: catColor,
          flexShrink: 0,
        }}
      >
        {senderInitial}
      </div>

      {/* Sender + Subject */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, gap: 1 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: !email.isRead ? 700 : 500,
            color: !email.isRead ? 'var(--t1)' : 'var(--t2)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {email.senderName || email.senderEmail}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: !email.isRead ? 600 : 400,
            color: !email.isRead ? 'var(--t1)' : 'var(--t2)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {email.subject || '(no subject)'}
        </span>
      </div>

      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {email.hasAttachments && <Paperclip size={10} style={{ color: 'var(--t3)' }} />}
        <CategoryTag category={email.category} />
        <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace', minWidth: 28, textAlign: 'right' }}>
          {formatRelative(email.receivedAt)}
        </span>
        <PriorityBars priority={email.priority as 'HIGH' | 'MEDIUM' | 'LOW'} />
      </div>
    </div>
  );
};
