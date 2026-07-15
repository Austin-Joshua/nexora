import React from 'react';
import type { BrainMessage } from '../../types/Brain';
import { BrainMessageComponent } from './BrainMessage';
import { BrainInput } from './BrainInput';
import { useBrain } from '../../hooks/useBrain';
import { useAuthStore } from '../../store/authStore';
import { Brain, Sparkles, RotateCcw } from 'lucide-react';

const SUGGESTED_QUERIES: Record<string, string[]> = {
  STUDENT: [
    "What assignments are due this week?",
    "Any hackathons I should register for?",
    "What did my professor say about attendance?",
    "Are there any placement opportunities?",
    "Summarize my most important emails today",
  ],
  PROFESSOR: [
    "Any student queries I haven't responded to?",
    "What meetings do I have coming up?",
    "Summarize my research collaboration emails",
  ],
  DEFAULT: [
    "What are my most important emails today?",
    "Any upcoming deadlines I should know about?",
    "Summarize my recent communications",
  ],
};

export const BrainChat: React.FC = () => {
  const { messages, isLoading, historyLoading, sendQuery, clearMessages } = useBrain();
  const { user } = useAuthStore();
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = React.useState(false);

  // If history loaded some messages, show them immediately
  React.useEffect(() => {
    if (!historyLoading && messages.length > 0) {
      setHasStarted(true);
    }
  }, [historyLoading, messages.length]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (query: string) => {
    setHasStarted(true);
    sendQuery(query);
  };

  const handleClear = () => {
    clearMessages();
    setHasStarted(false);
  };


  const suggestions = SUGGESTED_QUERIES[user?.userRole ?? 'DEFAULT'] ?? SUGGESTED_QUERIES.DEFAULT;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 animate-glow"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
          }}
        >
          <Brain size={19} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-[15px] font-bold text-white leading-tight">Nexora Brain</h2>
          <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">
            Natural language Q&A over your entire inbox
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#a5b4fc',
            }}
          >
            <Sparkles size={10} className="animate-pulse-soft" /> AI Powered
          </span>
          {hasStarted && messages.length > 0 && (
            <button
              onClick={handleClear}
              className="p-2 text-slate-600 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-all duration-200"
              title="Clear conversation"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {!hasStarted && messages.length === 0 ? (
          <WelcomeState suggestions={suggestions} onSend={handleSend} />
        ) : (
          <div className="p-5 space-y-4 max-w-5xl mx-auto">
            {messages.map((msg: BrainMessage, i) => (
              <div
                key={msg.id}
                className={msg.type === 'user' ? 'animate-msg-user' : 'animate-msg-ai'}
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <BrainMessageComponent message={msg} />
              </div>
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="p-4 border-t flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto">
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
  <div className="flex flex-col items-center justify-center h-full px-6 py-10 gap-8 animate-fade-in">
    {/* Icon */}
    <div className="text-center">
      <div
        className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-5 animate-float"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(124,58,237,0.15))',
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 8px 40px rgba(99,102,241,0.2)',
        }}
      >
        <Brain size={40} className="text-indigo-400" />
      </div>
      <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Ask your inbox anything</h3>
      <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
        Nexora Brain reads all your emails and answers in plain English.
        <span className="text-slate-400"> No searching required.</span>
      </p>
    </div>

    {/* Suggestions */}
    <div className="w-full max-w-lg space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 text-center mb-4">
        Try asking...
      </p>
      {suggestions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSend(q)}
          className={`w-full text-left p-3.5 rounded-2xl text-sm text-slate-400 hover:text-white transition-all duration-250 group animate-fade-in delay-${(i + 1) * 100}`}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.07)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.25)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
          }}
        >
          <span className="text-indigo-500 mr-2 group-hover:text-indigo-400 transition-colors">→</span>
          {q}
        </button>
      ))}
    </div>
  </div>
);

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-3 animate-msg-ai">
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
    >
      <Brain size={14} className="text-white" />
    </div>
    <div
      className="px-4 py-3 rounded-2xl rounded-tl-none"
      style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
    >
      <div className="flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: '#818cf8',
              animation: `bounce-dots 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
        <span className="text-xs text-slate-500 ml-1">Thinking...</span>
      </div>
    </div>
  </div>
);
