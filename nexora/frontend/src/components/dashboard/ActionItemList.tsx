import React, { useState } from 'react';
import { CheckSquare, Clock, CheckCircle2, Check } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

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

export const ActionItemList: React.FC<ActionItemListProps> = ({ actions }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [completing, setCompleting] = useState<Set<number>>(new Set());
  const [localCompleted, setLocalCompleted] = useState<Set<number>>(new Set());

  const handleComplete = async (e: React.MouseEvent, actionId: number) => {
    e.stopPropagation();
    if (completing.has(actionId)) return;
    setCompleting(prev => new Set(prev).add(actionId));
    // Optimistically hide it
    setLocalCompleted(prev => new Set(prev).add(actionId));
    try {
      await axiosInstance.patch(`/api/email-actions/${actionId}/complete`);
      // Invalidate dashboard query to refresh counts
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    } catch {
      // Rollback on error
      setLocalCompleted(prev => {
        const s = new Set(prev);
        s.delete(actionId);
        return s;
      });
    } finally {
      setCompleting(prev => {
        const s = new Set(prev);
        s.delete(actionId);
        return s;
      });
    }
  };

  const visibleActions = actions.filter(a => !localCompleted.has(a.id));

  return (
    <div className="surface" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: 'rgba(240,192,48,0.12)',
            border: '1px solid rgba(240,192,48,0.20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CheckSquare size={12} style={{ color: '#f0c030' }} />
        </div>
        <span className="section-label" style={{ flex: 1 }}>PENDING ACTIONS</span>
        {visibleActions.length > 0 && (
          <span
            style={{
              padding: '1px 7px',
              background: 'rgba(240,192,48,0.12)',
              border: '1px solid rgba(240,192,48,0.25)',
              borderRadius: 9999,
              fontSize: 10,
              fontWeight: 700,
              color: '#f0c030',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {visibleActions.length}
          </span>
        )}
      </div>

      {/* List */}
      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
        {visibleActions.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <CheckCircle2 size={24} style={{ color: '#40c070', margin: '0 auto 8px', display: 'block', opacity: 0.6 }} />
            <p style={{ color: 'var(--t2)', fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>All done!</p>
            <p style={{ color: 'var(--t3)', fontSize: 10, margin: 0 }}>No pending actions right now</p>
          </div>
        ) : (
          visibleActions.map((action, i) => (
            <div
              key={action.id}
              onClick={() => action.emailId && navigate(`/inbox?emailId=${action.emailId}`)}
              className={`animate-fade-in delay-${(i + 1) * 50}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '10px 14px',
                borderBottom: '1px solid var(--border)',
                cursor: action.emailId ? 'pointer' : 'default',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => { if (action.emailId) (e.currentTarget as HTMLElement).style.background = 'var(--s2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
            >
              {/* Checkbox */}
              <button
                onClick={(e) => handleComplete(e, action.id)}
                title="Mark complete"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 3,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#40c070';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(64,192,112,0.10)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {completing.has(action.id) && (
                  <Check size={10} style={{ color: '#40c070' }} />
                )}
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, color: 'var(--t1)', margin: '0 0 3px', lineHeight: 1.4, fontWeight: 500 }}>
                  {action.actionDescription}
                </p>
                {action.emailSubject && (
                  <p style={{ fontSize: 10, color: 'var(--t3)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {action.emailSubject}
                  </p>
                )}
                {action.deadline && (
                  <p style={{ fontSize: 9, color: '#f0c030', margin: 0, display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'JetBrains Mono, monospace' }}>
                    <Clock size={8} /> {formatDateTime(action.deadline)}
                  </p>
                )}
              </div>

              <span
                style={{
                  padding: '1px 5px',
                  background: 'rgba(79,158,255,0.08)',
                  border: '1px solid rgba(79,158,255,0.20)',
                  borderRadius: 3,
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#4f9eff',
                  fontFamily: 'JetBrains Mono, monospace',
                  flexShrink: 0,
                }}
              >
                {action.actionType}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
