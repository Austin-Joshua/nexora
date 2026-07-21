import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { AppShell } from '../components/layout/AppShell';
import { PriorityFeed } from '../components/dashboard/PriorityFeed';
import { DeadlineCard } from '../components/dashboard/DeadlineCard';
import { ActionItemList } from '../components/dashboard/ActionItemList';
import { StatCard } from '../components/common/StatCard';
import { useAuthStore } from '../store/authStore';
import { useEmails } from '../hooks/useEmails';
import { CAT_COLORS } from '../utils/catColors';
import { Mail, Clock, ListCheck, Tag, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { sync, isSyncing } = useEmails();
  const navigate = useNavigate();

  const hasSynced = React.useRef(false);
  React.useEffect(() => {
    if (user && !user.lastSyncedAt && !hasSynced.current) {
      hasSynced.current = true;
      sync();
    }
  }, [user?.lastSyncedAt]);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.getSummary,
    staleTime: 300_000,
    refetchInterval: isSyncing ? 3000 : false,
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <AppShell>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', margin: 0, fontFamily: 'Google Sans, Roboto, sans-serif' }}>
            {greeting}, {firstName}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '4px 0 0' }}>
            Here is your Gmail intelligence summary and action item feed.
          </p>
        </div>

        {isSyncing && (
          <div
            className="surface-elevated animate-fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderLeft: '4px solid var(--accent)',
            }}
          >
            <RefreshCw size={16} style={{ color: 'var(--accent)' }} className="animate-spin" />
            <span style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>
              Syncing your Gmail inbox with Nexora AI intelligence...
            </span>
          </div>
        )}

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="animate-fade-in">
              <StatCard
                label="Unread Mail"
                value={data?.unreadCount ?? 0}
                accentColor="var(--danger)"
                icon={Mail}
                sub="require attention"
              />
              <StatCard
                label="Upcoming Deadlines"
                value={data?.upcomingDeadlines?.length ?? 0}
                accentColor="var(--star)"
                icon={Clock}
                sub="next 7 days"
              />
              <StatCard
                label="Pending Actions"
                value={data?.pendingActions?.length ?? 0}
                accentColor="var(--accent)"
                icon={ListCheck}
                sub="action items"
              />
              <StatCard
                label="Categories"
                value={Object.keys(data?.categoryCounts ?? {}).length}
                accentColor="var(--cat-assignment)"
                icon={Tag}
                sub="classified topics"
              />
            </div>

            {Object.keys(data?.categoryCounts ?? {}).length > 0 && (
              <div className="animate-fade-in">
                <p className="section-label" style={{ marginBottom: 8 }}>CATEGORY LABELS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {Object.entries(data?.categoryCounts ?? {}).map(([cat, count]) => {
                    const cfg = CAT_COLORS[cat];
                    const color = cfg?.color ?? '#5f6368';
                    return (
                      <button
                        key={cat}
                        onClick={() => navigate(`/inbox?category=${cat}`)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 12px',
                          background: color + '18',
                          border: `1px solid ${color}30`,
                          borderRadius: 16,
                          color,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {cfg?.label ?? cat}
                        <span style={{ fontSize: 11, opacity: 0.8 }}>({count as number})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16 }} className="animate-fade-in">
              <PriorityFeed emails={data?.priorityEmails ?? []} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p className="section-label">UPCOMING DEADLINES</p>
                {(data?.upcomingDeadlines?.length ?? 0) === 0 ? (
                  <div className="surface-elevated" style={{ padding: 24, textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-2)', fontSize: 13, margin: 0 }}>No deadlines in next 7 days</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {data?.upcomingDeadlines?.map((email: any) => (
                      <DeadlineCard key={email.id} email={email} />
                    ))}
                  </div>
                )}
              </div>

              <ActionItemList actions={data?.pendingActions ?? []} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
};

const DashboardSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 90 }} />
      ))}
    </div>
    <div className="skeleton" style={{ height: 40 }} />
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 260 }} />
      ))}
    </div>
  </div>
);
