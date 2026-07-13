import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { emailApi } from '../../api/emailApi';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDateTime } from '../../utils/formatDate';
import { Paperclip, Clock, CheckSquare, X, Calendar, Brain, ChevronDown, Sparkles } from 'lucide-react';

interface EmailDetailProps {
  emailId: number;
  onClose?: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ emailId, onClose }) => {
  const [showFullBody, setShowFullBody] = useState(false);

  const { data: email, isLoading } = useQuery({
    queryKey: ['email', emailId],
    queryFn: () => emailApi.getEmail(emailId),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-5 space-y-4 animate-fade-in">
        <div className="h-8 skeleton rounded-xl w-3/4" />
        <div className="h-12 skeleton rounded-xl" />
        <div className="h-24 skeleton rounded-xl" />
        <div className="h-48 skeleton rounded-xl" />
      </div>
    );
  }

  if (!email) return null;

  const actionItems = (() => {
    if (email.actions && Array.isArray(email.actions)) {
      return email.actions.map((a: any) => ({
        description: a.actionDescription || a.description,
        deadline: a.deadline,
        action_type: a.actionType || a.action_type,
      }));
    }
    try {
      if (email.aiActionItems) {
        const parsed = typeof email.aiActionItems === 'string' 
          ? JSON.parse(email.aiActionItems) 
          : email.aiActionItems;
        if (Array.isArray(parsed)) {
          return parsed.map((a: any) => ({
            description: a.description || a.actionDescription,
            deadline: a.deadline,
            action_type: a.action_type || a.actionType,
          }));
        } else if (parsed && typeof parsed === 'object') {
          const arr = parsed.action_items || parsed.actions || [];
          if (Array.isArray(arr)) {
            return arr.map((a: any) => ({
              description: a.description || a.actionDescription,
              deadline: a.deadline,
              action_type: a.action_type || a.actionType,
            }));
          }
        }
      }
    } catch (err) {
      console.error("Failed to parse aiActionItems:", err);
    }
    return [];
  })();


  const bodyText = email.bodyFull || email.bodySnippet || '';
  const isLong = bodyText.length > 800;
  const displayBody = isLong && !showFullBody ? bodyText.slice(0, 800) + '...' : bodyText;

  return (
    <div className="h-full flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div
        className="px-6 py-5 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold text-white leading-snug flex-1">
            {email.subject || '(no subject)'}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-600 hover:text-white hover:bg-white/8 rounded-xl transition-all duration-200 flex-shrink-0"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sender */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
          >
            {(email.senderName || email.senderEmail)[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200 leading-tight">{email.senderName || 'Unknown'}</p>
            <p className="text-xs text-slate-500 leading-tight mt-0.5">
              {email.senderEmail} · {formatDateTime(email.receivedAt)}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <CategoryBadge category={email.category} />
          <PriorityBadge priority={email.priority} />
          {email.hasAttachments && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(100,116,139,0.12)', border: '1px solid rgba(100,116,139,0.2)', color: '#94a3b8' }}
            >
              <Paperclip size={10} /> Attachments
            </span>
          )}
          {email.deadlineDetected && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
            >
              <Calendar size={10} /> {formatDateTime(email.deadlineDetected)}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* AI Summary */}
        {email.aiSummary && (
          <div
            className="rounded-2xl p-4 animate-fade-in"
            style={{
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.18)',
              borderLeft: '3px solid rgba(99,102,241,0.6)',
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
              >
                <Brain size={12} className="text-white" />
              </div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">AI Summary</span>
              <Sparkles size={11} className="text-indigo-500 ml-auto" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{email.aiSummary}</p>
          </div>
        )}

        {/* Action Items */}
        {actionItems.length > 0 && (
          <div className="animate-fade-in delay-100">
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare size={14} className="text-amber-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Action Items ({actionItems.length})
              </p>
            </div>
            <div className="space-y-2">
              {actionItems.map((a: any, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.25)' }}
                  >
                    <CheckSquare size={11} className="text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 leading-snug">{a.description}</p>
                    {a.deadline && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <Clock size={10} /> Due: {formatDateTime(a.deadline)}
                      </p>
                    )}
                  </div>
                  {a.action_type && (
                    <span
                      className="flex-shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}
                    >
                      {a.action_type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email body */}
        <div className="animate-fade-in delay-200">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Content</p>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-light">
              {displayBody || '(no content)'}
            </p>
            {isLong && (
              <button
                onClick={() => setShowFullBody(f => !f)}
                className="mt-4 flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-200"
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${showFullBody ? 'rotate-180' : ''}`}
                />
                {showFullBody ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
