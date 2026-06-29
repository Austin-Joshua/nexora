import React from 'react';
import type { Email } from '../../types/Email';
import { formatRelative } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';

interface PriorityFeedProps {
  emails: Email[];
}

export const PriorityFeed: React.FC<PriorityFeedProps> = ({ emails }) => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3.5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <Flame size={13} className="text-red-400" />
        </div>
        <h3 className="font-bold text-white text-sm flex-1">Priority Inbox</h3>
        {emails.length > 0 && (
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#fca5a5',
            }}
          >
            {emails.length} HIGH
          </span>
        )}
      </div>

      {/* List */}
      <div>
        {emails.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-slate-500 text-sm font-medium">All clear!</p>
            <p className="text-slate-600 text-xs mt-1">No high-priority emails right now</p>
          </div>
        ) : (
          emails.map((email, i) => (
            <div
              key={email.id}
              onClick={() => navigate(`/inbox?emailId=${email.id}`)}
              className={`group px-4 py-3.5 cursor-pointer transition-all duration-200 hover:bg-white/[0.03] border-b animate-fade-in delay-${(i + 1) * 50}`}
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.6), rgba(99,102,241,0.6))',
                    boxShadow: '0 2px 8px rgba(239,68,68,0.2)',
                  }}
                >
                  {(email.senderName || email.senderEmail)[0]?.toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-white truncate leading-tight">
                      {email.senderName || email.senderEmail}
                    </p>
                    <span className="text-[10px] text-slate-600 flex-shrink-0 font-medium">
                      {formatRelative(email.receivedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate leading-snug">{email.subject}</p>
                  {email.aiSummary && (
                    <p className="text-[10px] text-slate-600 truncate mt-1 leading-snug">
                      ✦ {email.aiSummary}
                    </p>
                  )}
                </div>

                <ArrowRight
                  size={13}
                  className="text-slate-700 group-hover:text-indigo-400 flex-shrink-0 mt-1 transition-all duration-200 group-hover:translate-x-0.5"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
