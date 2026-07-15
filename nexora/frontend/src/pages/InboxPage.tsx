import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { EmailList } from '../components/email/EmailList';
import { EmailDetail } from '../components/email/EmailDetail';
import { SenderView } from '../components/email/SenderView';
import { useEmails } from '../hooks/useEmails';
import { useEmailStore } from '../store/emailStore';
import type { EmailCategory } from '../types/Email';
import { SlidersHorizontal, Users, Search, X, Eye, EyeOff } from 'lucide-react';

type ViewMode = EmailCategory | 'ALL' | 'SENDERS';

const CATEGORIES: Array<{ key: ViewMode; label: string; emoji: string }> = [
  { key: 'ALL',          label: 'All',          emoji: '📥' },
  { key: 'SENDERS',     label: 'Senders',      emoji: '👤' },
  { key: 'ASSIGNMENT',  label: 'Assignments',  emoji: '📚' },
  { key: 'HACKATHON',   label: 'Hackathons',   emoji: '🚀' },
  { key: 'PLACEMENT',   label: 'Placement',    emoji: '💼' },
  { key: 'INTERNSHIP',  label: 'Internships',  emoji: '🌟' },
  { key: 'MEETING',     label: 'Meetings',     emoji: '📅' },
  { key: 'ATTENDANCE',  label: 'Attendance',   emoji: '🎓' },
  { key: 'ANNOUNCEMENT',label: 'Announcements',emoji: '📢' },
  { key: 'RESEARCH',    label: 'Research',     emoji: '🔬' },
  { key: 'PERSONAL',    label: 'Personal',     emoji: '👤' },
];

export const InboxPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlEmailId = searchParams.get('emailId');
  const urlCategory = searchParams.get('category') as ViewMode | null;
  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>(urlCategory ?? 'ALL');
  const [inboxSearch, setInboxSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { setActiveCategory, selectedEmail, setSelectedEmail } = useEmailStore();
  const { emails, isLoading, categoryCounts } = useEmails();

  // Sync URL category param into active view on mount
  useEffect(() => {
    if (urlCategory && CATEGORIES.some(c => c.key === urlCategory)) {
      setActiveView(urlCategory);
      setActiveCategory(urlCategory as EmailCategory | 'ALL');
    }
  }, [urlCategory]);

  useEffect(() => {
    if (urlEmailId && emails.length > 0) {
      const found = emails.find((e) => e.id === parseInt(urlEmailId));
      if (found) setSelectedEmail(found);
    }
  }, [urlEmailId, emails]);

  // Filter displayed emails by local search and unread toggle
  const displayedEmails = emails.filter((email) => {
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

  return (
    <AppShell title="Inbox" subtitle="Your Gmail, intelligently organized">
      <div className="flex h-full overflow-hidden flex-col">
        {/* Category / View tabs */}
        <div
          className="flex-shrink-0 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          {/* Tab scroll */}
          <div className="overflow-x-auto">
            <div className="flex gap-1 p-3 min-w-max">
              {CATEGORIES.map(({ key, label, emoji }) => {
                const isActive = activeView === key;
                const isSenders = key === 'SENDERS';
                const count = !isSenders && key !== 'ALL'
                  ? (categoryCounts[key as string] ?? 0)
                  : undefined;

                return (
                  <button
                    key={key}
                    id={`category-tab-${key.toLowerCase()}`}
                    onClick={() => handleTabClick(key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200"
                    style={isActive ? {
                      background: isSenders
                        ? 'rgba(16,185,129,0.15)'
                        : 'rgba(99,102,241,0.15)',
                      border: `1px solid ${isSenders ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}`,
                      color: isSenders ? '#6ee7b7' : '#a5b4fc',
                      boxShadow: `0 2px 8px ${isSenders ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)'}`,
                    } : {
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: 'rgba(100,116,139,0.9)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.color = 'white';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.color = 'rgba(100,116,139,0.9)';
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }
                    }}
                  >
                    <span className="text-[11px]">{emoji}</span>
                    {label}
                    {isSenders && isActive && (
                      <Users size={10} className="ml-0.5 text-emerald-400" />
                    )}
                    {count !== undefined && count > 0 && (
                      <span
                        className="ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={isActive ? {
                          background: 'rgba(99,102,241,0.25)',
                          color: '#c7d2fe',
                        } : {
                          background: 'rgba(255,255,255,0.08)',
                          color: '#64748b',
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

          {/* Toolbar: count, search, filters (only shown for email list views) */}
          {activeView !== 'SENDERS' && (
            <div className="px-3 pb-2 flex items-center gap-2">
              <span className="text-[10px] text-slate-600 font-semibold flex-shrink-0">
                {displayedEmails.length} email{displayedEmails.length !== 1 ? 's' : ''}
              </span>

              {/* Inline search */}
              <div className={`relative flex-1 max-w-xs transition-all duration-200 ${searchFocused ? 'flex-none w-56' : 'w-44'}`}>
                <Search
                  size={11}
                  className={`absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors ${searchFocused ? 'text-indigo-400' : 'text-slate-600'}`}
                />
                <input
                  id="inbox-search"
                  type="text"
                  placeholder="Search..."
                  value={inboxSearch}
                  onChange={(e) => setInboxSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-7 pr-6 py-1 text-[11px] rounded-lg text-slate-300 placeholder-slate-600 focus:outline-none transition-all duration-200"
                  style={{
                    background: searchFocused ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
                    border: searchFocused ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.07)',
                  }}
                />
                {inboxSearch && (
                  <button
                    onClick={() => setInboxSearch('')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>

              {/* Unread only toggle */}
              <button
                id="unread-only-toggle"
                onClick={() => setUnreadOnly(u => !u)}
                className="flex items-center gap-1 text-[10px] font-semibold transition-colors duration-200 flex-shrink-0"
                style={{ color: unreadOnly ? '#a5b4fc' : 'rgba(100,116,139,0.9)' }}
                title={unreadOnly ? 'Show all emails' : 'Show unread only'}
              >
                {unreadOnly ? <EyeOff size={10} /> : <Eye size={10} />}
                {unreadOnly ? 'Unread' : 'All'}
              </button>

              <button
                onClick={() => setShowFilters(f => !f)}
                className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-300 transition-colors duration-200 font-semibold flex-shrink-0"
              >
                <SlidersHorizontal size={10} />
                {showFilters ? 'Hide' : 'Filter'}
              </button>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {activeView === 'SENDERS' ? (
            <SenderView />
          ) : (
            <div className="flex h-full overflow-hidden relative">
              {/* Left panel: list (hidden on mobile if an email is selected) */}
              <div
                className={`w-full md:w-96 flex-shrink-0 md:border-r flex flex-col overflow-hidden transition-all duration-300 ${
                  selectedEmail ? 'hidden md:flex' : 'flex'
                }`}
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex-1 overflow-y-auto">
                  <EmailList
                    emails={displayedEmails}
                    isLoading={isLoading}
                    onEmailSelect={(email) => setSelectedEmail(email)}
                  />
                </div>
              </div>

              {/* Right panel: detail (full screen on mobile if selected) */}
              <div
                className={`flex-1 overflow-hidden transition-all duration-300 ${
                  selectedEmail || urlEmailId ? 'flex' : 'hidden md:flex'
                }`}
              >
                {selectedEmail || urlEmailId ? (
                  <div className="w-full h-full animate-slide-right">
                    <EmailDetail
                      emailId={selectedEmail ? selectedEmail.id : parseInt(urlEmailId!)}
                      onClose={() => {
                        setSelectedEmail(null);
                        navigate('/inbox', { replace: true });
                      }}
                    />
                  </div>
                ) : (
                  <EmptyDetail />
                )}
              </div>
            </div>

          )}
        </div>
      </div>
    </AppShell>
  );
};

const EmptyDetail: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center animate-fade-in">
      <div
        className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-5 animate-float"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <span className="text-4xl">✉️</span>
      </div>
      <p className="text-slate-300 font-bold text-base">Select an email to read</p>
      <p className="text-slate-600 text-sm mt-1.5 font-medium">Choose from your inbox on the left</p>
    </div>
  </div>
);
