import React, { useState } from 'react';
import { CheckSquare, CheckCircle2 } from 'lucide-react';
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
    setLocalCompleted(prev => new Set(prev).add(actionId));
    try {
      await axiosInstance.patch(`/api/email-actions/${actionId}/complete`);
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    } catch {
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
    <div className="surface-elevated" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <CheckSquare size={16} style={{ color: 'var(--accent)' }} />
        <span className="section-label" style={{ flex: 1 }}>PENDING ACTIONS</span>
        {visibleActions.length > 0 && (
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
            {visibleActions.length}
          </span>
        )}
      </div>

      {/* List */}
      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        {visibleActions.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <CheckCircle2 size={24} style={{ color: 'var(--success)', margin: '0 auto 8px', display: 'block' }} />
            <p style={{ color: 'var(--text-1)', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>All caught up!</p>
            <p style={{ color: 'var(--text-2)', fontSize: 12, margin: 0 }}>No pending action items right now.</p>
          </div>
        ) : (
          visibleActions.map((action) => (
            <div
              key={action.id}
              onClick={() => action.emailId && navigate(`/inbox?emailId=${action.emailId}`)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
                cursor: action.emailId ? 'pointer' : 'default',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={e => { if (action.emailId) (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <input
                type="checkbox"
                checked={completing.has(action.id)}
                onChange={(e) => handleComplete(e as any, action.id)}
                style={{ marginTop: 2, cursor: 'pointer', accentColor: 'var(--accent)' }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, color: 'var(--text-1)', margin: '0 0 2px', lineHeight: 1.4, fontWeight: 500 }}>
                  {action.actionDescription}
                </p>
                {action.emailSubject && (
                  <p style={{ fontSize: 11, color: 'var(--text-2)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {action.emailSubject}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
