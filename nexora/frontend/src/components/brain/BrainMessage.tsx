import React from 'react';
import type { BrainMessage } from '../../types/Brain';
import { Brain, User as UserIcon, ExternalLink } from 'lucide-react';
import { formatRelative } from '../../utils/formatDate';

interface Props {
  message: BrainMessage;
  onEmailClick: (id: number) => void;
}

export const BrainMessageComponent: React.FC<Props> = ({ message, onEmailClick }) => {
  const isUser = message.type === 'user';

  return (
    <div style={{ display: 'flex', gap: 12, flexDirection: isUser ? 'row-reverse' : 'row' }}>
      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: isUser ? '#1e2d3f' : 'rgba(79,158,255,0.12)',
          border: `1px solid ${isUser ? 'var(--border)' : 'rgba(79,158,255,0.25)'}`,
          color: isUser ? 'var(--t2)' : '#4f9eff',
        }}
      >
        {isUser ? <UserIcon size={14} /> : <Brain size={14} />}
      </div>

      {/* Content wrapper */}
      <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 6, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        {/* Label */}
        <span className="section-label" style={{ fontSize: 8 }}>
          {isUser ? 'You' : 'Brain'}
        </span>

        {/* Bubble */}
        <div
          className={isUser ? 'bubble-user' : 'bubble-ai'}
          style={{
            maxWidth: '100%',
            alignSelf: 'unset',
          }}
        >
          {message.content}
        </div>

        {/* Source Emails */}
        {!isUser && message.referencedEmails && message.referencedEmails.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', marginTop: 4 }}>
            <span className="section-label" style={{ fontSize: 8 }}>SOURCE EMAILS ({message.referencedEmails.length})</span>
            {message.referencedEmails.map((email) => (
              <button
                key={email.id}
                onClick={() => onEmailClick(email.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: 'var(--s1)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(79,158,255,0.35)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--s2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--s1)';
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {email.subject || '(no subject)'}
                  </p>
                  <p style={{ fontSize: 9, color: 'var(--t3)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {email.senderName || email.senderEmail}
                  </p>
                </div>
                <ExternalLink size={11} style={{ color: 'var(--t3)' }} />
              </button>
            ))}
          </div>
        )}

        <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>
          {formatRelative(message.timestamp.toISOString())}
        </span>
      </div>
    </div>
  );
};
