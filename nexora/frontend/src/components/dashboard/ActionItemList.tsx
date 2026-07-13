import React from 'react';
import { CheckSquare, Clock, CheckCircle2 } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';

interface ActionItem {
  id: number;
  actionType: string;
  actionDescription: string;
  deadline?: string;
  isCompleted: boolean;
  emailSubject?: string;
  senderName?: string;
  emailId?: number;
}

interface ActionItemListProps {
  actions: ActionItem[];
}

const TYPE_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  REGISTER: { color: '#fdba74', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)' },
  REPLY:    { color: '#93c5fd', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)' },
  SUBMIT:   { color: '#fca5a5', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)' },
  UPLOAD:   { color: '#c4b5fd', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.25)' },
  REVIEW:   { color: '#67e8f9', bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.25)' },
  ATTEND:   { color: '#6ee7b7', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)' },
  OTHER:    { color: '#94a3b8', bg: 'rgba(100,116,139,0.1)',  border: 'rgba(100,116,139,0.2)' },
};

const DEFAULT_CFG = TYPE_CONFIG.OTHER;

export const ActionItemList: React.FC<ActionItemListProps> = ({ actions }) => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3.5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.2)' }}
        >
          <CheckSquare size={13} className="text-amber-400" />
        </div>
        <h3 className="font-bold text-white text-sm flex-1">Pending Actions</h3>
        {actions.length > 0 && (
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)', color: '#fde047' }}
          >
            {actions.length}
          </span>
        )}
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto">
        {actions.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-2.5 opacity-60" />
            <p className="text-slate-500 text-sm font-semibold">All done!</p>
            <p className="text-slate-600 text-xs mt-1">No pending actions right now</p>
          </div>
        ) : (
          actions.map((action, i) => {
            const cfg = TYPE_CONFIG[action.actionType] ?? DEFAULT_CFG;
            const isClickable = !!action.emailId;
            return (
              <div
                key={action.id}
                onClick={() => {
                  if (isClickable) {
                    navigate(`/inbox?emailId=${action.emailId}`);
                  }
                }}
                className={`px-4 py-3.5 border-b transition-all duration-200 hover:bg-white/[0.025] animate-fade-in delay-${(i + 1) * 50} ${
                  isClickable ? 'cursor-pointer hover:translate-x-0.5' : ''
                }`}
                style={{ borderColor: 'rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-start gap-3">
                  {/* Dot indicator */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}60` }}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 leading-snug font-medium">
                      {action.actionDescription}
                    </p>
                    {action.emailSubject && (
                      <p className="text-[10px] text-slate-600 truncate mt-0.5 leading-tight">
                        {action.emailSubject}
                      </p>
                    )}
                    {action.deadline && (
                      <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-semibold">
                        <Clock size={9} /> {formatDateTime(action.deadline)}
                      </p>
                    )}
                  </div>

                  <span
                    className="flex-shrink-0 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wide"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
                  >
                    {action.actionType}
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
