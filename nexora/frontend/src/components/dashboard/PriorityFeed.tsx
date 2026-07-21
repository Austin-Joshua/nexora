import React from 'react';
import type { Email } from '../../types/Email';
import { formatRelative } from '../../utils/formatDate';
import { CategoryTag } from '../common/CategoryTag';
import { Sparkles } from 'lucide-react';

interface PriorityFeedProps {
  emails: Email[];
  onEmailClick?: (email: Email) => void;
}

export const PriorityFeed: React.FC<PriorityFeedProps> = ({ emails, onEmailClick }) => {
  return (
    <div className="card-paper" style={{ overflow: 'hidden', padding: 0 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 20px',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <Sparkles size={18} style={{ color: 'var(--ember)' }} />
        <span className="section-label" style={{ flex: 1 }}>PRIORITY FEED</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
          {emails.length} urgent
        </span>
      </div>

      {/* Feed List */}
      <div>
        {emails.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-2)', fontSize: 13 }}>
            No high-priority emails right now.
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              onClick={() => onEmailClick?.(email)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 20px',
                borderBottom: '1px solid var(--line)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--paper-2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: email.isRead ? 400 : 700, color: 'var(--text-1)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {email.subject || '(no subject)'}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {email.senderName || email.senderEmail}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <CategoryTag category={email.category} />
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{formatRelative(email.receivedAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
