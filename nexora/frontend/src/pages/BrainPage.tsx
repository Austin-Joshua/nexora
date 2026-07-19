import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { BrainChat } from '../components/brain/BrainChat';
import { brainApi } from '../api/brainApi';
import type { BrainConversation } from '../types/Brain';
import { History, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const formatRelativeTime = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins === 1) return '1m ago';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 3600000);
    if (hrs === 1) return '1h ago';
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return '1d ago';
    return `${days}d ago`;
  } catch { return ''; }
};

export const BrainPage: React.FC = () => {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [conversations, setConversations] = useState<BrainConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  const fetchHistory = () => {
    brainApi.getHistory().then(setConversations).catch(() => {});
  };

  useEffect(() => {
    fetchHistory();
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
            width: historyOpen ? 220 : 0,
            borderRight: historyOpen ? '1px solid var(--border)' : 'none',
            background: 'var(--s1)',
          }}
        >
          {historyOpen && (
            <>
              {/* Header */}
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
                <span className="section-label" style={{ flex: 1 }}>HISTORY</span>
              </div>

              {/* New Conversation Button */}
              <button
                onClick={() => setSelectedConversationId(null)}
                className="btn-gold"
                style={{
                  margin: '8px 8px 4px',
                  padding: '6px 12px',
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  cursor: 'pointer',
                }}
              >
                <Plus size={12} /> New conversation
              </button>

              {/* History list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {conversations.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--t3)', fontSize: 11, padding: 16 }}>No history yet</div>
                ) : conversations.map((conv) => {
                  const isSelected = conv.id === selectedConversationId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 6,
                        background: isSelected ? 'rgba(240,192,48,0.05)' : 'var(--s1)',
                        border: isSelected ? '1px solid #f0c030' : '1px solid var(--border)',
                        borderLeft: isSelected ? '3px solid #f0c030' : '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,192,48,0.30)';
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      }}
                    >
                      <p style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: isSelected ? '#f0c030' : 'var(--t1)',
                        margin: '0 0 4px',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {conv.userQuery}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--t3)', fontSize: 9 }}>
                        <Clock size={8} />
                        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{formatRelativeTime(conv.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setHistoryOpen(o => !o)}
          style={{
            position: 'absolute',
            left: historyOpen ? 220 : 0,
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
          <BrainChat 
            selectedConversationId={selectedConversationId} 
            setSelectedConversationId={setSelectedConversationId} 
            onNewConversationSaved={fetchHistory}
          />
        </div>
      </div>
    </AppShell>
  );
};
