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
      <div className="space-y-0">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-4 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.04)', animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 skeleton rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 skeleton rounded-full w-2/3" />
                <div className="h-2.5 skeleton rounded-full w-full" />
                <div className="h-2.5 skeleton rounded-full w-1/2" />
                <div className="flex gap-2 mt-3">
                  <div className="h-4 w-20 skeleton rounded-full" />
                  <div className="h-4 w-14 skeleton rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-float"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Inbox size={26} className="text-slate-600" />
        </div>
        <p className="text-slate-400 font-bold text-sm">No emails found</p>
        <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
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
          style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
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
