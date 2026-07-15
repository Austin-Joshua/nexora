import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { BrainChat } from '../components/brain/BrainChat';
import { brainApi } from '../api/brainApi';
import type { BrainConversation } from '../types/Brain';
import { History, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

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
      <div className="flex h-full overflow-hidden relative">
        {/* History sidebar */}
        <div
          className="flex-shrink-0 border-r transition-all duration-300 overflow-hidden flex flex-col"
          style={{
            width: historyOpen ? '240px' : '0px',
            borderColor: historyOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
            background: 'rgba(5,8,20,0.6)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {historyOpen && (
            <>
              <div
                className="flex items-center gap-2 px-4 py-3 border-b flex-shrink-0"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <History size={13} className="text-indigo-400" />
                <span className="text-xs font-bold text-white">Past Conversations</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {conversations.length === 0 ? (
                  <div className="text-center text-slate-600 text-[11px] p-4">No history yet</div>
                ) : conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-2.5 rounded-xl cursor-default group transition-all duration-150 hover:bg-white/4"
                    style={{ border: '1px solid transparent' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                  >
                    <p className="text-[11px] font-medium text-slate-300 leading-snug line-clamp-2">
                      {conv.userQuery}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={9} className="text-slate-600" />
                      <span className="text-[9px] text-slate-600">{formatDate(conv.createdAt)}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 line-clamp-1 italic">
                      {conv.aiResponse}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setHistoryOpen(o => !o)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-5 h-10 rounded-r-lg transition-all duration-200 hover:bg-indigo-500/20"
          style={{
            background: 'rgba(15,23,42,0.8)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderLeft: 'none',
            color: '#818cf8',
            left: historyOpen ? '240px' : '0px',
          }}
          title={historyOpen ? 'Close history' : 'Open history'}
        >
          {historyOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* Main chat */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <BrainChat />
        </div>
      </div>
    </AppShell>
  );
};
