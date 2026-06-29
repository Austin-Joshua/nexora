import React from 'react';
import type { Email } from '../../types/Email';
import { formatDateTime } from '../../utils/formatDate';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { CategoryBadge } from '../email/CategoryBadge';
import { useNavigate } from 'react-router-dom';

interface DeadlineCardProps {
  email: Email;
}

export const DeadlineCard: React.FC<DeadlineCardProps> = ({ email }) => {
  const navigate = useNavigate();

  // Calculate urgency
  const deadlineDate = email.deadlineDetected ? new Date(email.deadlineDetected) : null;
  const now = new Date();
  const daysUntil = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isUrgent = daysUntil !== null && daysUntil <= 2;
  const isSoon = daysUntil !== null && daysUntil <= 5;

  return (
    <div
      onClick={() => navigate(`/inbox?emailId=${email.id}`)}
      className="flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 group"
      style={{
        background: isUrgent ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.03)',
        border: isUrgent
          ? '1px solid rgba(239,68,68,0.2)'
          : isSoon
          ? '1px solid rgba(234,179,8,0.15)'
          : '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = isUrgent
          ? 'rgba(239,68,68,0.1)'
          : 'rgba(255,255,255,0.05)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = isUrgent
          ? 'rgba(239,68,68,0.07)'
          : 'rgba(255,255,255,0.03)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Calendar icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={isUrgent ? {
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.25)',
        } : {
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Calendar size={16} className={isUrgent ? 'text-red-400' : 'text-slate-400'} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-100 truncate leading-snug">{email.subject}</p>
        <p className="text-[10px] text-slate-600 truncate leading-snug mt-0.5">
          {email.senderName || email.senderEmail}
        </p>
        {email.deadlineDetected && (
          <p className={`text-[10px] mt-1 flex items-center gap-1 font-bold ${isUrgent ? 'text-red-400' : isSoon ? 'text-amber-400' : 'text-slate-500'}`}>
            <Clock size={9} />
            {daysUntil !== null && daysUntil <= 0
              ? 'Due today!'
              : daysUntil === 1
              ? 'Due tomorrow'
              : `Due ${formatDateTime(email.deadlineDetected)}`}
          </p>
        )}
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <CategoryBadge category={email.category} />
        <ArrowRight
          size={13}
          className="text-slate-700 group-hover:text-indigo-400 transition-all duration-200 group-hover:translate-x-0.5"
        />
      </div>
    </div>
  );
};
