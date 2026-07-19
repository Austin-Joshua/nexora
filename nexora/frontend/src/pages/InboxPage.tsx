import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { EmailList } from '../components/email/EmailList';
import { EmailDetail } from '../components/email/EmailDetail';
import { SenderView } from '../components/email/SenderView';
import { useEmails } from '../hooks/useEmails';
import { useEmailStore } from '../store/emailStore';
import { emailApi } from '../api/emailApi';
import { useQueryClient } from '@tanstack/react-query';
import type { EmailCategory } from '../types/Email';
import { Eye, EyeOff } from 'lucide-react';
import { CAT_COLORS } from '../utils/catColors';

type ViewMode = EmailCategory | 'ALL' | 'SENDERS';

const TABS: Array<{ key: ViewMode; label: string }> = [
  { key: 'ALL',           label: 'All' },
  { key: 'SENDERS',      label: 'Senders' },
  { key: 'ASSIGNMENT',   label: 'Assignments' },
  { key: 'HACKATHON',    label: 'Hackathons' },
  { key: 'PLACEMENT',    label: 'Placement' },
  { key: 'ATTENDANCE',   label: 'Attendance' },
  { key: 'MEETING',      label: 'Meetings' },
  { key: 'ANNOUNCEMENT', label: 'Announcements' },
  { key: 'RESEARCH',     label: 'Research' },
  { key: 'PERSONAL',     label: 'Personal' },
];

export const InboxPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlEmailId = searchParams.get('emailId');
  const urlCategory = searchParams.get('category') as ViewMode | null;

  // C.9 — read URL params on mount
  const [activeView, setActiveView] = useState<ViewMode>(urlCategory ?? 'ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [inboxSearch, setInboxSearch] = useState('');

  const { setActiveCategory, selectedEmail, setSelectedEmail } = useEmailStore();
  const { emails, isLoading, categoryCounts } = useEmails();

  // Sync URL category on mount
  useEffect(() => {
    if (urlCategory && TABS.some(t => t.key === urlCategory)) {
      setActiveView(urlCategory);
      setActiveCategory(urlCategory as EmailCategory | 'ALL');
    }
  }, [urlCategory]);

  // C.9 — open email from URL emailId param
  useEffect(() => {
    if (urlEmailId && emails.length > 0) {
      const found = emails.find(e => e.id === parseInt(urlEmailId));
      if (found) setSelectedEmail(found);
    }
  }, [urlEmailId, emails]);

  const displayedEmails = emails.filter(email => {
    const matchesSearch = !inboxSearch || (
      email.subject?.toLowerCase().includes(inboxSearch.toLowerCase()) ||
      email.senderName?.toLowerCase().includes(inboxSearch.toLowerCase()) ||
      email.senderEmail?.toLowerCase().includes(inboxSearch.toLowerCase())
    );
    const matchesUnread = !unreadOnly || !email.isRead;
    return matchesSearch && matchesUnread;
  });

  const handleTabClick = (key: ViewMode) => {
    setActiveView(key);
    if (key !== 'SENDERS') {
      setActiveCategory(key as EmailCategory | 'ALL');
    }
    setSelectedEmail(null);
  };

  // C.8 — Mark email as read on open
  const handleEmailSelect = async (email: any) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      try {
        await emailApi.markRead(email.id);
        // Invalidate dashboard unread count
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      } catch {
        // Silently ignore - not critical
      }
    }
  };

  return (
    <AppShell title="Inbox" subtitle="Your Gmail, intelligently organized">
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
        {/* Tab bar */}
        <div
          style={{
            flexShrink: 0,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: 4, padding: '8px 12px', minWidth: 'max-content' }}>
              {TABS.map(({ key, label }) => {
                const isActive = activeView === key;
                const count = key !== 'ALL' && key !== 'SENDERS'
                  ? (categoryCounts[key as string] ?? 0)
                  : undefined;
                const catColor = key !== 'ALL' && key !== 'SENDERS' ? CAT_COLORS[key]?.color : undefined;

                return (
                  <button
                    key={key}
                    id={`category-tab-${key.toLowerCase()}`}
                    onClick={() => handleTabClick(key)}
                    className={`tab-item${isActive ? ' active' : ''}`}
                    style={isActive && catColor ? {
                      color: catColor,
                      background: catColor + '18',
                      borderColor: catColor + '40',
                    } : {}}
                  >
                    {label}
                    {count !== undefined && count > 0 && (
                      <span
                        style={{
                          padding: '0 5px',
                          borderRadius: 9999,
                          fontSize: 9,
                          fontWeight: 700,
                          background: isActive ? 'rgba(240,192,48,0.20)' : 'rgba(61,85,112,0.30)',
                          color: isActive ? '#f0c030' : 'var(--t3)',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toolbar */}
          {activeView !== 'SENDERS' && (
            <div style={{ padding: '0 12px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--t3)',
                  fontFamily: 'JetBrains Mono, monospace',
                  flexShrink: 0,
                }}
              >
                {displayedEmails.length} email{displayedEmails.length !== 1 ? 's' : ''}
              </span>

              <input
                id="inbox-search"
                type="text"
                placeholder="Search emails..."
                value={inboxSearch}
                onChange={e => setInboxSearch(e.target.value)}
                style={{
                  flex: 1,
                  maxWidth: 200,
                  height: 26,
                  background: 'var(--s1)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '0 8px',
                  fontSize: 11,
                  color: 'var(--t1)',
                  outline: 'none',
                }}
                onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(79,158,255,0.45)'; }}
                onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
              />

              <button
                id="unread-only-toggle"
                onClick={() => setUnreadOnly(u => !u)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  color: unreadOnly ? '#f0c030' : 'var(--t3)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: 4,
                  transition: 'color 0.15s ease',
                }}
                title={unreadOnly ? 'Show all emails' : 'Show unread only'}
              >
                {unreadOnly ? <EyeOff size={10} /> : <Eye size={10} />}
                {unreadOnly ? 'Unread' : 'All'}
              </button>
            </div>
          )}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activeView === 'SENDERS' ? (
            <SenderView />
          ) : (
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
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <EmailList
                    emails={displayedEmails}
                    isLoading={isLoading}
                    onEmailSelect={handleEmailSelect}
                  />
                </div>
              </div>

              {/* Detail panel */}
              {(selectedEmail || urlEmailId) && (
                <div style={{ flex: 1, overflow: 'hidden' }} className="animate-slide-right">
                  <EmailDetail
                    emailId={selectedEmail ? selectedEmail.id : parseInt(urlEmailId!)}
                    onClose={() => {
                      setSelectedEmail(null);
                      navigate('/inbox', { replace: true });
                    }}
                  />
                </div>
              )}

              {!selectedEmail && !urlEmailId && (
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
                        fontSize: 28,
                      }}
                    >
                      ✉️
                    </div>
                    <p style={{ color: 'var(--t1)', fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>
                      Select an email
                    </p>
                    <p style={{ color: 'var(--t3)', fontSize: 11, margin: 0 }}>
                      Choose from your inbox on the left
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};
