import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { BrainChat } from '../components/brain/BrainChat';
import { brainApi } from '../api/brainApi';
import type { BrainConversation } from '../types/Brain';
import { History, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return ''; }
};

export const BrainPage: React.FC = () => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState<BrainConversation[]>([]);

  useEffect(() => {
    brainApi.getHistory().then(setConversations).catch(() => {});
  }, []);

  return (
    <AppShell title="Nexora Brain" subtitle="Natural language Q&A over your emails">
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden', position: 'relative' }}>
        {/* History sidebar */}
        <div
          style={{
            flexShrink: 0,
            transition: 'width 0.25s ease',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: historyOpen ? 240 : 0,
            borderRight: historyOpen ? '1px solid var(--border)' : 'none',
            background: '#060a0f',
          }}
        >
          {historyOpen && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--border)',
                  flexShrink: 0,
                }}
              >
                <History size={12} style={{ color: '#4f9eff' }} />
                <span className="section-label">PAST QUERIES</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {conversations.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--t3)', fontSize: 11, padding: 16 }}>No history yet</div>
                ) : conversations.map((conv) => (
                  <div
                    key={conv.id}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: 'var(--s1)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--t1)', margin: '0 0 4px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {conv.userQuery}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--t3)', fontSize: 9 }}>
                      <Clock size={8} />
                      <span>{formatDate(conv.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setHistoryOpen(o => !o)}
          style={{
            position: 'absolute',
            left: historyOpen ? 240 : 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: 14,
            height: 38,
            borderRadius: '0 6px 6px 0',
            background: 'var(--s1)',
            border: '1px solid var(--border)',
            borderLeft: 'none',
            color: 'var(--t3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'left 0.25s ease',
          }}
          title={historyOpen ? 'Close history' : 'Open history'}
        >
          {historyOpen ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
        </button>

        {/* Main chat */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <BrainChat />
        </div>
      </div>
    </AppShell>
  );
};
