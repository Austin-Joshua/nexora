import React from 'react';
import type { Email } from '../../types/Email';
import { formatRelative } from '../../utils/formatDate';
import { CategoryTag } from '../common/CategoryTag';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PriorityFeedProps {
  emails: Email[];
}

export const PriorityFeed: React.FC<PriorityFeedProps> = ({ emails }) => {
  const navigate = useNavigate();

  return (
    <div className="surface-elevated" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Sparkles size={16} style={{ color: 'var(--accent)' }} />
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
              onClick={() => navigate(`/inbox?emailId=${email.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: email.isRead ? 400 : 700, color: 'var(--text-1)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
