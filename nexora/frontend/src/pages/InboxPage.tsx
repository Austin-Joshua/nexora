import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { EmailList } from '../components/email/EmailList';
import { EmailDetail } from '../components/email/EmailDetail';
import { useEmails } from '../hooks/useEmails';
import { useEmailStore } from '../store/emailStore';
import type { EmailCategory } from '../types/Email';
import { SlidersHorizontal } from 'lucide-react';

const CATEGORIES: Array<{ key: EmailCategory | 'ALL'; label: string; emoji: string }> = [
  { key: 'ALL',          label: 'All',          emoji: '📥' },
  { key: 'ASSIGNMENT',   label: 'Assignments',  emoji: '📚' },
  { key: 'HACKATHON',    label: 'Hackathons',   emoji: '🚀' },
  { key: 'PLACEMENT',    label: 'Placement',    emoji: '💼' },
  { key: 'INTERNSHIP',   label: 'Internships',  emoji: '🌟' },
  { key: 'MEETING',      label: 'Meetings',     emoji: '📅' },
  { key: 'ATTENDANCE',   label: 'Attendance',   emoji: '🎓' },
  { key: 'ANNOUNCEMENT', label: 'Announcements',emoji: '📢' },
  { key: 'RESEARCH',     label: 'Research',     emoji: '🔬' },
  { key: 'PERSONAL',     label: 'Personal',     emoji: '👤' },
];

export const InboxPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlEmailId = searchParams.get('emailId');
  const [showFilters, setShowFilters] = useState(false);

  const { activeCategory, setActiveCategory, selectedEmail, setSelectedEmail } = useEmailStore();
  const { emails, isLoading, categoryCounts } = useEmails();

  useEffect(() => {
    if (urlEmailId && emails.length > 0) {
      const found = emails.find((e) => e.id === parseInt(urlEmailId));
      if (found) setSelectedEmail(found);
    }
  }, [urlEmailId, emails]);

  return (
    <AppShell title="Inbox" subtitle="Your Gmail, intelligently organized">
      <div className="flex h-full overflow-hidden">
        {/* Left panel: list */}
        <div className="w-96 flex-shrink-0 border-r flex flex-col overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {/* Category tabs */}
          <div
            className="flex-shrink-0 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            {/* Category scroll */}
            <div className="overflow-x-auto">
              <div className="flex gap-1 p-3 min-w-max">
                {CATEGORIES.map(({ key, label, emoji }) => {
                  const isActive = activeCategory === key;
                  const count = key !== 'ALL' ? (categoryCounts[key] ?? 0) : undefined;
                  return (
                    <button
                      key={key}
                      id={`category-tab-${key.toLowerCase()}`}
                      onClick={() => setActiveCategory(key)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200"
                      style={isActive ? {
                        background: 'rgba(99,102,241,0.15)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        color: '#a5b4fc',
                        boxShadow: '0 2px 8px rgba(99,102,241,0.15)',
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

            {/* Filter toggle */}
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 font-semibold">
                {emails.length} email{emails.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setShowFilters(f => !f)}
                className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-300 transition-colors duration-200 font-semibold"
              >
                <SlidersHorizontal size={10} />
                {showFilters ? 'Hide' : 'Filter'}
              </button>
            </div>
          </div>

          {/* Email list */}
          <div className="flex-1 overflow-y-auto">
            <EmailList
              emails={emails}
              isLoading={isLoading}
              onEmailSelect={(email) => setSelectedEmail(email)}
            />
          </div>
        </div>

        {/* Right panel: detail */}
        <div className="flex-1 overflow-hidden">
          {selectedEmail ? (
            <div className="h-full animate-slide-right">
              <EmailDetail
                emailId={selectedEmail.id}
                onClose={() => setSelectedEmail(null)}
              />
            </div>
          ) : (
            <EmptyDetail />
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
