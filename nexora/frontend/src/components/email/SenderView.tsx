import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { emailApi, type SenderSummary } from '../../api/emailApi';
import { EmailList } from './EmailList';
import { EmailDetail } from './EmailDetail';
import { useEmailStore } from '../../store/emailStore';
import { Mail, ArrowLeft, TrendingUp, User2, ChevronRight } from 'lucide-react';

const rankColors = [
  { bg: 'rgba(240,192,48,0.10)', border: 'rgba(240,192,48,0.22)', text: '#f0c030', badge: '🥇' },
  { bg: 'rgba(120,144,168,0.10)', border: 'rgba(120,144,168,0.22)', text: 'var(--t2)', badge: '🥈' },
  { bg: 'rgba(180,123,67,0.10)', border: 'rgba(180,123,67,0.22)', text: '#b47b43', badge: '🥉' },
];

interface SenderCardProps {
  sender: SenderSummary;
  rank: number;
  onClick: () => void;
}

const SenderCard: React.FC<SenderCardProps> = ({ sender, rank, onClick }) => {
  const initials = ((sender.senderName || sender.senderEmail)?.[0] ?? '?').toUpperCase();
  const rankStyle = rank < 3 ? rankColors[rank] : null;

  return (
    <button
      onClick={onClick}
      id={`sender-card-${rank}`}
      style={{
        width: '100%',
        textAlign: 'left',
        background: rankStyle ? rankStyle.bg : 'transparent',
        border: `1px solid ${rankStyle ? rankStyle.border : 'var(--border)'}`,
        borderRadius: 8,
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'var(--s2)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-b)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = rankStyle ? rankStyle.bg : 'transparent';
        (e.currentTarget as HTMLElement).style.borderColor = rankStyle ? rankStyle.border : 'var(--border)';
      }}
    >
      {/* Rank Badge */}
      <div style={{ flexShrink: 0, width: 20, textAlign: 'center' }}>
        {rank < 3 ? (
          <span style={{ fontSize: 13 }}>{rankColors[rank].badge}</span>
        ) : (
          <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--t3)' }}>
            #{rank + 1}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: 'rgba(79,158,255,0.12)',
          border: '1px solid rgba(79,158,255,0.25)',
          color: '#4f9eff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {sender.senderName || 'Unknown Sender'}
        </p>
        <p style={{ fontSize: 9, color: 'var(--t3)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace' }}>
          {sender.senderEmail}
        </p>
      </div>

      {/* Count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 6px',
            background: 'rgba(79,158,255,0.08)',
            border: '1px solid rgba(79,158,255,0.20)',
            borderRadius: 4,
          }}
        >
          <Mail size={10} style={{ color: '#4f9eff' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#4f9eff', fontFamily: 'JetBrains Mono, monospace' }}>
            {sender.emailCount}
          </span>
        </div>
        <ChevronRight size={12} style={{ color: 'var(--t3)' }} />
      </div>
    </button>
  );
};

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
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* List panel */}
      <div
        style={{
          width: selectedEmail ? 280 : '100%',
          flexShrink: 0,
          borderRight: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease',
        }}
      >
        <div style={{ padding: 12, borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <button
            onClick={onBack}
            className="btn-ghost"
            style={{
              fontSize: 10,
              padding: '4px 8px',
              marginBottom: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <ArrowLeft size={10} /> Back to Senders
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'rgba(79,158,255,0.12)',
                border: '1px solid rgba(79,158,255,0.25)',
                color: '#4f9eff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {((sender.senderName || sender.senderEmail)?.[0] ?? '?').toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {sender.senderName || 'Unknown'}
              </p>
              <p style={{ fontSize: 9, color: 'var(--t3)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace' }}>
                {sender.senderEmail}
              </p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <EmailList
            emails={emails}
            isLoading={isLoading}
            onEmailSelect={(e) => setSelectedEmail(e)}
          />
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {selectedEmail ? (
          <div style={{ height: '100%' }} className="animate-slide-right">
            <EmailDetail emailId={selectedEmail.id} onClose={() => setSelectedEmail(null)} />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <div style={{ textAlign: 'center', margin: 'auto' }} className="animate-fade-in">
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: 'var(--s1)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
                className="animate-float"
              >
                <User2 size={28} style={{ color: 'var(--t3)' }} />
              </div>
              <p style={{ color: 'var(--t1)', fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>Select an email</p>
              <p style={{ color: 'var(--t3)', fontSize: 11, margin: 0 }}>
                Showing {emails.length} email{emails.length !== 1 ? 's' : ''} from this sender
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 48 }} />
        ))}
      </div>
    );
  }

  if (senders.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            background: 'var(--s1)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <TrendingUp size={24} style={{ color: 'var(--t3)' }} />
        </div>
        <p style={{ color: 'var(--t1)', fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>No sender data yet</p>
        <p style={{ color: 'var(--t3)', fontSize: 11, margin: 0 }}>Sync your inbox first to see sender stats</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          width: 320,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          background: 'var(--s1)',
        }}
      >
        <div style={{ padding: 12, borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <TrendingUp size={12} style={{ color: '#4f9eff' }} />
            <span className="section-label">TOP SENDERS</span>
          </div>
          <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>
            {senders.length} unique senders · click to browse
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
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

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }} className="animate-fade-in">
          <div
            style={{
              width: 64,
              height: 64,
              background: 'var(--s1)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
            className="animate-float"
          >
            <User2 size={28} style={{ color: 'var(--t3)' }} />
          </div>
          <p style={{ color: 'var(--t1)', fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>Select a sender</p>
          <p style={{ color: 'var(--t3)', fontSize: 11, margin: 0 }}>
            Choose from the leaderboard on the left
          </p>
        </div>
      </div>
    </div>
  );
};
