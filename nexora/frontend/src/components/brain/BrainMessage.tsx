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
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: isUser ? 'var(--surface-2)' : 'var(--accent-soft)',
          border: '1px solid var(--border)',
          color: isUser ? 'var(--text-1)' : 'var(--accent)',
        }}
      >
        {isUser ? <UserIcon size={16} /> : <Brain size={16} />}
      </div>

      <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 6, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <span className="section-label" style={{ fontSize: 10 }}>
          {isUser ? 'You' : 'Brain'}
        </span>

        <div
          style={{
            maxWidth: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            background: isUser ? 'var(--accent-soft)' : 'var(--surface)',
            color: isUser ? 'var(--accent)' : 'var(--text-1)',
            border: '1px solid var(--border)',
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {message.content}
        </div>

        {!isUser && message.referencedEmails && message.referencedEmails.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', marginTop: 4 }}>
            <span className="section-label" style={{ fontSize: 10 }}>SOURCE EMAILS ({message.referencedEmails.length})</span>
            {message.referencedEmails.map((email) => (
              <button
                key={email.id}
                onClick={() => onEmailClick(email.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {email.subject || '(no subject)'}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-2)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {email.senderName || email.senderEmail}
                  </p>
                </div>
                <ExternalLink size={12} style={{ color: 'var(--text-3)' }} />
              </button>
            ))}
          </div>
        )}

        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
          {formatRelative(message.timestamp.toISOString())}
        </span>
      </div>
    </div>
  );
};
