import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { emailApi, type SenderSummary } from '../../api/emailApi';
import { EmailList } from './EmailList';
import { EmailDetail } from './EmailDetail';
import { useEmailStore } from '../../store/emailStore';
import { Mail, ArrowLeft, TrendingUp, User2, ChevronRight } from 'lucide-react';

// ─── Colour palette cycling for sender avatars ───────────────────────────────
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#6366f1,#7c3aed)',
  'linear-gradient(135deg,#0ea5e9,#2563eb)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#d97706)',
  'linear-gradient(135deg,#ec4899,#db2777)',
  'linear-gradient(135deg,#8b5cf6,#6d28d9)',
  'linear-gradient(135deg,#14b8a6,#0d9488)',
  'linear-gradient(135deg,#f97316,#ea580c)',
];

const rankColors = [
  { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24', badge: '🥇' },
  { bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.25)', text: '#94a3b8', badge: '🥈' },
  { bg: 'rgba(180,123,67,0.10)', border: 'rgba(180,123,67,0.25)', text: '#b47b43', badge: '🥉' },
];

// ─── SenderCard ───────────────────────────────────────────────────────────────
interface SenderCardProps {
  sender: SenderSummary;
  rank: number;
  onClick: () => void;
}

const SenderCard: React.FC<SenderCardProps> = ({ sender, rank, onClick }) => {
  const gradient = AVATAR_GRADIENTS[rank % AVATAR_GRADIENTS.length];
  const initials = ((sender.senderName || sender.senderEmail)?.[0] ?? '?').toUpperCase();
  const rankStyle = rank < 3 ? rankColors[rank] : null;

  return (
    <button
      onClick={onClick}
      id={`sender-card-${rank}`}
      className="w-full text-left group transition-all duration-200 rounded-2xl p-4 flex items-center gap-3"
      style={{
        background: rankStyle ? rankStyle.bg : 'rgba(255,255,255,0.02)',
        border: `1px solid ${rankStyle ? rankStyle.border : 'rgba(255,255,255,0.06)'}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = rankStyle
          ? rankStyle.bg
          : 'rgba(255,255,255,0.05)';
        (e.currentTarget as HTMLElement).style.borderColor = rankStyle
          ? rankStyle.border
          : 'rgba(99,102,241,0.25)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = rankStyle
          ? rankStyle.bg
          : 'rgba(255,255,255,0.02)';
        (e.currentTarget as HTMLElement).style.borderColor = rankStyle
          ? rankStyle.border
          : 'rgba(255,255,255,0.06)';
      }}
    >
      {/* Rank badge */}
      <div className="flex-shrink-0 w-6 text-center">
        {rank < 3 ? (
          <span className="text-base leading-none">{rankColors[rank].badge}</span>
        ) : (
          <span className="text-xs font-black text-slate-600">#{rank + 1}</span>
        )}
      </div>

      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{ background: gradient, boxShadow: `0 4px 14px rgba(0,0,0,0.25)` }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-200 truncate leading-tight">
          {sender.senderName || 'Unknown Sender'}
        </p>
        <p className="text-[11px] text-slate-500 truncate mt-0.5">{sender.senderEmail}</p>
        {sender.latestSubject && (
          <p className="text-[11px] text-slate-600 truncate mt-0.5 italic">
            "{sender.latestSubject}"
          </p>
        )}
      </div>

      {/* Count pill + arrow */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
          style={{
            background: rankStyle ? `rgba(255,255,255,0.06)` : 'rgba(99,102,241,0.12)',
            border: `1px solid ${rankStyle ? rankStyle.border : 'rgba(99,102,241,0.2)'}`,
          }}
        >
          <Mail size={10} className={rankStyle ? '' : 'text-indigo-400'} style={rankStyle ? { color: rankStyle.text } : undefined} />
          <span
            className="text-xs font-black"
            style={{ color: rankStyle ? rankStyle.text : '#a5b4fc' }}
          >
            {sender.emailCount}
          </span>
        </div>
        <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
      </div>
    </button>
  );
};

// ─── SenderEmailsPane ─────────────────────────────────────────────────────────
interface SenderEmailsPaneProps {
  sender: SenderSummary;
  onBack: () => void;
}

const SenderEmailsPane: React.FC<SenderEmailsPaneProps> = ({ sender, onBack }) => {
  const { selectedEmail, setSelectedEmail } = useEmailStore();

  const { data, isLoading } = useQuery({
    queryKey: ['emails-by-sender', sender.senderEmail],
    queryFn: () => emailApi.getEmailsFromSender(sender.senderEmail),
    staleTime: 60_000,
  });

  const emails = data?.content ?? [];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: sender email list */}
      <div
        className="w-96 flex-shrink-0 flex flex-col overflow-hidden border-r"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-4 py-4 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-3 font-semibold"
          >
            <ArrowLeft size={12} /> Back to Senders
          </button>

          {/* Sender info header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
              style={{ background: AVATAR_GRADIENTS[0], boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
            >
              {((sender.senderName || sender.senderEmail)?.[0] ?? '?').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{sender.senderName || 'Unknown'}</p>
              <p className="text-xs text-slate-500 truncate">{sender.senderEmail}</p>
            </div>
            <div
              className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-xl flex-shrink-0"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <Mail size={10} className="text-indigo-400" />
              <span className="text-xs font-black text-indigo-300">{sender.emailCount}</span>
            </div>
          </div>
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto">
          <EmailList
            emails={emails}
            isLoading={isLoading}
            onEmailSelect={(e) => setSelectedEmail(e)}
          />
        </div>
      </div>

      {/* Right: email detail */}
      <div className="flex-1 overflow-hidden">
        {selectedEmail ? (
          <div className="h-full animate-slide-right">
            <EmailDetail emailId={selectedEmail.id} onClose={() => setSelectedEmail(null)} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center animate-fade-in">
              <div
                className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <User2 size={32} className="text-slate-600" />
              </div>
              <p className="text-slate-300 font-bold text-base">Select an email to read</p>
              <p className="text-slate-600 text-sm mt-1.5">
                Showing {emails.length} email{emails.length !== 1 ? 's' : ''} from this sender
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SenderView (main export) ─────────────────────────────────────────────────
export const SenderView: React.FC = () => {
  const [activeSender, setActiveSender] = useState<SenderSummary | null>(null);
  const { setSelectedEmail } = useEmailStore();

  const { data: senders = [], isLoading } = useQuery({
    queryKey: ['sender-summary'],
    queryFn: emailApi.getSenderSummary,
    staleTime: 120_000,
  });

  const handleSenderClick = (sender: SenderSummary) => {
    setSelectedEmail(null);
    setActiveSender(sender);
  };

  if (activeSender) {
    return (
      <SenderEmailsPane
        sender={activeSender}
        onBack={() => { setActiveSender(null); setSelectedEmail(null); }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 skeleton rounded-2xl" style={{ animationDelay: `${i * 60}ms` }} />
        ))}
      </div>
    );
  }

  if (senders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 animate-fade-in">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <TrendingUp size={24} className="text-slate-600" />
        </div>
        <p className="text-slate-400 font-bold mb-1">No sender data yet</p>
        <p className="text-slate-600 text-sm">Sync your inbox first to see sender statistics</p>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sender leaderboard panel */}
      <div
        className="w-96 flex-shrink-0 flex flex-col overflow-hidden border-r"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-4 py-3 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={13} className="text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Top Senders
            </span>
          </div>
          <p className="text-[10px] text-slate-600">
            {senders.length} unique sender{senders.length !== 1 ? 's' : ''} · click to browse emails
          </p>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {senders.map((sender, i) => (
            <SenderCard
              key={sender.senderEmail}
              sender={sender}
              rank={i}
              onClick={() => handleSenderClick(sender)}
            />
          ))}
        </div>
      </div>

      {/* Right panel: empty state */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-in px-6">
          <div
            className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <User2 size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-300 font-bold text-base">Select a sender</p>
          <p className="text-slate-600 text-sm mt-1.5">
            Choose from the leaderboard on the left to browse their emails
          </p>
        </div>
      </div>
    </div>
  );
};
