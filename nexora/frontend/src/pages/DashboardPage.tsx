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
import { CAT_COLORS, CATEGORY_LABELS } from '../utils/catColors';
import { Mail, Clock, ListCheck, Tag } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.getSummary,
    staleTime: 300_000,
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <AppShell
      title="Dashboard"
      subtitle={`${greeting}, ${firstName}`}
    >
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* ROW 1 — 4 StatCards */}
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}
              className="animate-fade-in"
            >
              <StatCard
                label="Unread"
                value={data?.unreadCount ?? 0}
                accentColor="#f05050"
                icon={Mail}
                sub="emails need attention"
              />
              <StatCard
                label="Deadlines"
                value={data?.upcomingDeadlines?.length ?? 0}
                accentColor="#f0c030"
                icon={Clock}
                sub="next 7 days"
              />
              <StatCard
                label="Pending Actions"
                value={data?.pendingActions?.length ?? 0}
                accentColor="#4f9eff"
                icon={ListCheck}
                sub="action items"
              />
              <StatCard
                label="Categories"
                value={Object.keys(data?.categoryCounts ?? {}).length}
                accentColor="#40c070"
                icon={Tag}
                sub="active categories"
              />
            </div>

            {/* ROW 2 — Category pill row */}
            {Object.keys(data?.categoryCounts ?? {}).length > 0 && (
              <div className="animate-fade-in delay-100">
                <p className="section-label" style={{ marginBottom: 8 }}>CATEGORY OVERVIEW</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {Object.entries(data?.categoryCounts ?? {}).map(([cat, count]) => {
                    const cfg = CAT_COLORS[cat];
                    const color = cfg?.color ?? '#3d5570';
                    return (
                      <button
                        key={cat}
                        onClick={() => navigate(`/inbox?category=${cat}`)}
                        title={`View ${CATEGORY_LABELS[cat] ?? cat} emails`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          background: color + '12',
                          border: `1px solid ${color}22`,
                          borderRadius: 6,
                          color,
                          fontSize: 10,
                          fontWeight: 700,
                          fontFamily: 'JetBrains Mono, monospace',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          letterSpacing: '0.04em',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = color + '22';
                          (e.currentTarget as HTMLElement).style.borderColor = color + '40';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = color + '12';
                          (e.currentTarget as HTMLElement).style.borderColor = color + '22';
                        }}
                      >
                        {cfg?.label ?? cat}
                        <span style={{ opacity: 0.7 }}>{count as number}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ROW 3 — Bento grid */}
            <div
              style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 10 }}
              className="animate-fade-in delay-200"
            >
              {/* Priority Feed */}
              <PriorityFeed emails={data?.priorityEmails ?? []} />

              {/* Upcoming Deadlines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p className="section-label">UPCOMING DEADLINES</p>
                {(data?.upcomingDeadlines?.length ?? 0) === 0 ? (
                  <div className="surface" style={{ padding: 32, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🎉</div>
                    <p style={{ color: 'var(--t2)', fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>No deadlines</p>
                    <p style={{ color: 'var(--t3)', fontSize: 10, margin: 0 }}>All caught up!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {data?.upcomingDeadlines?.map((email: any, i: number) => (
                      <div key={email.id} className={`animate-fade-in delay-${(i + 1) * 50}`}>
                        <DeadlineCard email={email} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Actions */}
              <ActionItemList actions={data?.pendingActions ?? []} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
};

const DashboardSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="animate-fade-in">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 88 }} />
      ))}
    </div>
    <div className="skeleton" style={{ height: 44 }} />
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 10 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 260 }} />
      ))}
    </div>
  </div>
);
