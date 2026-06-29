import React from 'react';
import type { Email } from '../../types/Email';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatRelative } from '../../utils/formatDate';
import { Paperclip, Clock } from 'lucide-react';
import { useEmailStore } from '../../store/emailStore';
import { emailApi } from '../../api/emailApi';

interface EmailCardProps {
  email: Email;
  onClick?: () => void;
  isSelected?: boolean;
}

const SENDER_COLORS = [
  'from-indigo-600 to-violet-600',
  'from-emerald-600 to-teal-600',
  'from-orange-600 to-red-600',
  'from-blue-600 to-cyan-600',
  'from-pink-600 to-rose-600',
  'from-amber-600 to-orange-600',
];

function getSenderColor(name: string): string {
  const idx = (name.charCodeAt(0) || 0) % SENDER_COLORS.length;
  return SENDER_COLORS[idx];
}

export const EmailCard: React.FC<EmailCardProps> = ({ email, onClick, isSelected }) => {
  const { setSelectedEmail } = useEmailStore();

  const handleClick = async () => {
    setSelectedEmail(email);
    onClick?.();
    if (!email.isRead) {
      emailApi.markRead(email.id).catch(() => {});
    }
  };

  const actionItems = (() => {
    try { return email.aiActionItems ? JSON.parse(email.aiActionItems) : []; }
    catch { return []; }
  })();

  const senderInitial = (email.senderName || email.senderEmail)[0]?.toUpperCase() ?? '?';
  const senderColor = getSenderColor(email.senderName || email.senderEmail);

  return (
    <div
      onClick={handleClick}
      className="relative p-4 cursor-pointer group transition-all duration-200 border-b animate-fade-in"
      style={{
        background: isSelected ? 'rgba(99,102,241,0.08)' : 'transparent',
        borderColor: 'rgba(255,255,255,0.05)',
        borderLeft: !email.isRead ? '2px solid rgba(99,102,241,0.7)' : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ background: 'linear-gradient(180deg, #6366f1, #7c3aed)' }}
        />
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar */}
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0 bg-gradient-to-br ${senderColor} transition-transform duration-200 group-hover:scale-105`}
          >
            {senderInitial}
          </div>
          <div className="min-w-0">
            <p className={`text-[13px] truncate leading-tight ${!email.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
              {email.senderName || email.senderEmail}
            </p>
            <p className="text-[10px] text-slate-600 truncate leading-tight">{email.senderEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {email.hasAttachments && <Paperclip size={11} className="text-slate-600" />}
          {!email.isRead && (
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#6366f1', boxShadow: '0 0 6px rgba(99,102,241,0.6)' }}
            />
          )}
          <span className="text-[10px] text-slate-600 font-medium">{formatRelative(email.receivedAt)}</span>
        </div>
      </div>

      {/* Subject */}
      <p className={`text-[13px] mb-1.5 truncate ${!email.isRead ? 'font-semibold text-slate-100' : 'text-slate-400'}`}>
        {email.subject || '(no subject)'}
      </p>

      {/* Preview */}
      {(email.aiSummary || email.bodySnippet) && (
        <p className="text-[11px] text-slate-600 line-clamp-1 mb-2.5 leading-relaxed">
          {email.aiSummary ? `✦ ${email.aiSummary}` : email.bodySnippet}
        </p>
      )}

      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-1">
        <CategoryBadge category={email.category} />
        <PriorityBadge priority={email.priority} />
        {email.deadlineDetected && (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}
          >
            <Clock size={9} /> Deadline
          </span>
        )}
        {actionItems.length > 0 && (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}
          >
            {actionItems.length} action{actionItems.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};
