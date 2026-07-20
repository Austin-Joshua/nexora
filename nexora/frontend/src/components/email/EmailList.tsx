import React from 'react';
import { EmailCard } from './EmailCard';
import type { Email } from '../../types/Email';
import { useEmailStore } from '../../store/emailStore';
import { Inbox } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  isLoading: boolean;
  onEmailSelect?: (email: Email) => void;
}

export const EmailList: React.FC<EmailListProps> = ({ emails, isLoading, onEmailSelect }) => {
  const { selectedEmail } = useEmailStore();

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              height: 48,
              padding: '0 14px',
              borderBottom: '1px solid var(--border)',
              animationDelay: `${i * 50}ms`,
            }}
            className="animate-fade-in"
          >
            {/* Avatar skeleton */}
            <div
              className="skeleton"
              style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0 }}
            />
            {/* Text skeleton */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div className="skeleton" style={{ height: 10, width: '45%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 9, width: '70%', borderRadius: 4 }} />
            </div>
            {/* Badge skeleton */}
            <div className="skeleton" style={{ height: 16, width: 56, borderRadius: 9999 }} />
          </div>
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            background: 'var(--s1)',
            border: '1px solid var(--border)',
          }}
        >
          <Inbox size={22} style={{ color: 'var(--t3)' }} />
        </div>
        <p style={{ color: 'var(--t2)', fontWeight: 700, fontSize: 13, margin: '0 0 4px' }}>
          No emails found
        </p>
        <p style={{ color: 'var(--t3)', fontSize: 11, margin: 0, lineHeight: 1.5 }}>
          Try a different category filter or sync your inbox.
        </p>
      </div>
    );
  }

  return (
    <div>
      {emails.map((email, i) => (
        <div
          key={email.id}
          className="animate-fade-in"
          style={{ animationDelay: `${Math.min(i * 25, 200)}ms` }}
        >
          <EmailCard
            email={email}
            isSelected={selectedEmail?.id === email.id}
            onClick={() => onEmailSelect?.(email)}
          />
        </div>
      ))}
    </div>
  );
};
