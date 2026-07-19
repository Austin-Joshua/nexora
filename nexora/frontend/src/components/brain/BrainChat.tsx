import React from 'react';
import type { BrainMessage } from '../../types/Brain';
import { BrainMessageComponent } from './BrainMessage';
import { BrainInput } from './BrainInput';
import { useBrain } from '../../hooks/useBrain';
import { useAuthStore } from '../../store/authStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { brainApi } from '../../api/brainApi';
import { Brain, Sparkles, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SUGGESTED_QUERIES: Record<string, string[]> = {
  STUDENT: [
    'What assignments are due this week?',
    'Any hackathons I should register for?',
    "What's my attendance status?",
    'Any placement opportunities?',
    'Summarize today\'s important emails',
  ],
  PROFESSOR: [
    'Any student queries I haven\'t responded to?',
    'What meetings do I have coming up?',
    'Summarize my research collaboration emails',
  ],
  DEFAULT: [
    'What are my most important emails today?',
    'Any upcoming deadlines I should know about?',
    'Summarize my recent communications',
  ],
};

interface BrainChatProps {
  selectedConversationId: number | null;
  setSelectedConversationId: (id: number | null) => void;
  onNewConversationSaved: () => void;
}

export const BrainChat: React.FC<BrainChatProps> = ({
  selectedConversationId,
  setSelectedConversationId,
  onNewConversationSaved,
}) => {
  const { messages, isLoading, sendQuery, clearMessages } = useBrain();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Load history from react-query
  const { data: history = [] } = useQuery({
    queryKey: ['brain-history'],
    queryFn: brainApi.getHistory,
    staleTime: 60_000,
  });

  // Filter displayed messages based on selected conversation id
  const displayedMessages = React.useMemo(() => {
    if (selectedConversationId) {
      const conv = history.find((c) => c.id === selectedConversationId);
      if (conv) {
        return [
          {
            id: `h-user-${conv.id}`,
            type: 'user' as const,
            content: conv.userQuery,
            timestamp: conv.createdAt ? new Date(conv.createdAt) : new Date(),
          },
          {
            id: `h-ai-${conv.id}`,
            type: 'assistant' as const,
            content: conv.aiResponse,
            timestamp: conv.createdAt ? new Date(conv.createdAt) : new Date(),
          },
        ];
      }
    }
    return messages;
  }, [selectedConversationId, history, messages]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages]);

  // Refetch history when active messages length increases (a new conversation is completed)
  React.useEffect(() => {
    if (messages.length > 0 && messages.length % 2 === 0) {
      queryClient.invalidateQueries({ queryKey: ['brain-history'] });
      onNewConversationSaved();
    }
  }, [messages.length, queryClient]);

  const handleSend = (query: string) => {
    if (selectedConversationId) {
      setSelectedConversationId(null);
      clearMessages();
    }
    sendQuery(query);
  };

  const handleClear = () => {
    setSelectedConversationId(null);
    clearMessages();
  };

  const suggestions = SUGGESTED_QUERIES[user?.userRole ?? 'DEFAULT'] ?? SUGGESTED_QUERIES.DEFAULT;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'rgba(79,158,255,0.10)',
            border: '1px solid rgba(79,158,255,0.20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Brain size={17} style={{ color: '#4f9eff' }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', margin: 0, lineHeight: 1 }}>
            {selectedConversationId ? 'Archive View' : 'Nexora Brain'}
          </p>
          <p style={{ fontSize: 10, color: 'var(--t3)', margin: '3px 0 0' }}>
            {selectedConversationId ? 'Viewing past conversation thread' : 'Natural language Q&A over your entire inbox'}
          </p>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '2px 8px',
            borderRadius: 9999,
            background: 'rgba(79,158,255,0.10)',
            border: '1px solid rgba(79,158,255,0.20)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.08em',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#4f9eff',
          }}
        >
          <Sparkles size={8} className="animate-pulse-soft" /> AI POWERED
        </span>
        {(displayedMessages.length > 0 || selectedConversationId) && (
          <button
            onClick={handleClear}
            className="btn-ghost"
            style={{ padding: '4px 10px', fontSize: 10 }}
            title="Clear conversation"
          >
            <RotateCcw size={11} /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {displayedMessages.length === 0 ? (
          <WelcomeState suggestions={suggestions} onSend={handleSend} />
        ) : (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 900, margin: '0 auto' }}>
            {displayedMessages.map((msg: BrainMessage, i) => (
              <div
                key={msg.id}
                style={{ animationDelay: `${Math.min(i * 20, 200)}ms` }}
                className={msg.type === 'user' ? 'animate-msg-user' : 'animate-msg-ai'}
              >
                <BrainMessageComponent message={msg} onEmailClick={(id) => navigate(`/inbox?emailId=${id}`)} />
              </div>
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <BrainInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

const WelcomeState: React.FC<{ suggestions: string[]; onSend: (q: string) => void }> = ({
  suggestions,
  onSend,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '32px 24px',
      gap: 28,
      textAlign: 'center',
    }}
    className="animate-fade-in"
  >
    <div>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          background: 'rgba(79,158,255,0.10)',
          border: '1px solid rgba(79,158,255,0.20)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
        className="animate-float"
      >
        <Brain size={24} style={{ color: '#4f9eff' }} />
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
        Ask your inbox anything
      </h3>
      <p style={{ fontSize: 12, color: 'var(--t2)', margin: 0, maxWidth: 280, lineHeight: 1.6 }}>
        Nexora Brain reads all your emails and answers in plain English. No searching required.
      </p>
    </div>

    <div style={{ width: '100%', maxWidth: 440 }}>
      <p className="section-label" style={{ marginBottom: 12 }}>TRY ASKING...</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {suggestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSend(q)}
            className={`animate-fade-in delay-${Math.min((i + 1) * 100, 500)}`}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 14px',
              background: 'var(--s1)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--t2)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,192,48,0.40)';
              (e.currentTarget as HTMLElement).style.color = '#f0c030';
              (e.currentTarget as HTMLElement).style.background = 'rgba(240,192,48,0.05)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.color = 'var(--t2)';
              (e.currentTarget as HTMLElement).style.background = 'var(--s1)';
            }}
          >
            → {q}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const TypingIndicator: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }} className="animate-msg-ai">
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 7,
        background: 'rgba(79,158,255,0.10)',
        border: '1px solid rgba(79,158,255,0.20)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Brain size={13} style={{ color: '#4f9eff' }} />
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '10px 14px',
        background: 'var(--s1)',
        border: '1px solid var(--border)',
        borderRadius: '10px 10px 10px 3px',
      }}
    >
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#4f9eff',
            animation: `tdot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <span style={{ fontSize: 11, color: 'var(--t3)', marginLeft: 4 }}>Thinking…</span>
    </div>
  </div>
);
