import React from 'react';
import type { Email } from '../../types/Email';
import { formatRelative } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { CategoryTag } from '../common/CategoryTag';
import { PriorityBars } from '../common/PriorityBars';
import { CAT_COLORS } from '../../utils/catColors';

interface PriorityFeedProps {
  emails: Email[];
}

export const PriorityFeed: React.FC<PriorityFeedProps> = ({ emails }) => {
  const navigate = useNavigate();

  return (
    <div className="surface" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: 'rgba(240,80,80,0.12)',
            border: '1px solid rgba(240,80,80,0.20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Flame size={12} style={{ color: '#f05050' }} />
        </div>
        <span className="section-label" style={{ flex: 1 }}>PRIORITY FEED</span>
        {emails.length > 0 && (
          <span
            style={{
              padding: '1px 7px',
              background: 'rgba(240,80,80,0.12)',
              border: '1px solid rgba(240,80,80,0.25)',
              borderRadius: 9999,
              fontSize: 10,
              fontWeight: 700,
              color: '#f05050',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {emails.length} HIGH
          </span>
        )}
      </div>

      {/* List */}
      <div>
        {emails.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🎉</div>
            <p style={{ color: 'var(--t2)', fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>All clear!</p>
            <p style={{ color: 'var(--t3)', fontSize: 10, margin: 0 }}>No high-priority emails right now</p>
          </div>
        ) : (
          emails.map((email, i) => {
            const catColor = CAT_COLORS[email.category]?.color ?? '#3d5570';
            const initial = (email.senderName || email.senderEmail)[0]?.toUpperCase();
            return (
              <div
                key={email.id}
                onClick={() => navigate(`/inbox?emailId=${email.id}`)}
                className={`animate-fade-in delay-${(i + 1) * 50}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderLeft: '3px solid #f05050',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--s1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 5,
                    background: catColor + '25',
                    border: `1px solid ${catColor}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 11,
                    fontWeight: 800,
                    color: catColor,
                  }}
                >
                  {initial}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {email.senderName || email.senderEmail}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--t2)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {email.subject}
                  </p>
                </div>

                {/* Right cluster */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <CategoryTag category={email.category} />
                  <PriorityBars priority={email.priority as 'HIGH' | 'MEDIUM' | 'LOW'} />
                  <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {formatRelative(email.receivedAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
