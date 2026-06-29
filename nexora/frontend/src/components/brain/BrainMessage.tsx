import React from 'react';
import type { BrainMessage } from '../../types/Brain';
import { Brain, User as UserIcon, ExternalLink } from 'lucide-react';
import { formatRelative } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';

interface Props { message: BrainMessage; }

export const BrainMessageComponent: React.FC<Props> = ({ message }) => {
  const navigate = useNavigate();
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
            : 'linear-gradient(135deg, #6366f1, #7c3aed)',
          boxShadow: isUser
            ? '0 2px 12px rgba(124,58,237,0.3)'
            : '0 2px 12px rgba(99,102,241,0.3)',
        }}
      >
        {isUser ? <UserIcon size={13} className="text-white" /> : <Brain size={13} className="text-white" />}
      </div>

      {/* Content */}
      <div className={`max-w-[78%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Label */}
        <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider px-1">
          {isUser ? 'You' : 'Nexora Brain'}
        </span>

        {/* Bubble */}
        <div
          className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
          style={isUser ? {
            background: 'rgba(99,102,241,0.18)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#e0e7ff',
            borderTopRightRadius: '4px',
          } : {
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#e2e8f0',
            borderTopLeftRadius: '4px',
          }}
        >
          {message.content}
        </div>

        {/* Referenced emails */}
        {!isUser && message.referencedEmails && message.referencedEmails.length > 0 && (
          <div className="space-y-1.5 w-full">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold px-1">
              Source emails ({message.referencedEmails.length})
            </p>
            {message.referencedEmails.map((email) => (
              <button
                key={email.id}
                onClick={() => navigate(`/inbox?emailId=${email.id}`)}
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group flex items-center gap-2.5"
                style={{
                  background: 'rgba(99,102,241,0.05)',
                  border: '1px solid rgba(99,102,241,0.12)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.12)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.05)';
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
                >
                  {(email.senderName || email.senderEmail)[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-300 truncate leading-tight">
                    {email.subject || '(no subject)'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate leading-tight">
                    {email.senderName || email.senderEmail}
                  </p>
                </div>
                <ExternalLink
                  size={11}
                  className="text-slate-700 group-hover:text-indigo-400 flex-shrink-0 transition-colors duration-200"
                />
              </button>
            ))}
          </div>
        )}

        <p className="text-[10px] text-slate-700 font-medium px-1">
          {formatRelative(message.timestamp.toISOString())}
        </p>
      </div>
    </div>
  );
};
