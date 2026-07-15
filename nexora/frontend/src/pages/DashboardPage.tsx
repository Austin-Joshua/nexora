import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { AppShell } from '../components/layout/AppShell';
import { QuickStats } from '../components/dashboard/QuickStats';
import { PriorityFeed } from '../components/dashboard/PriorityFeed';
import { DeadlineCard } from '../components/dashboard/DeadlineCard';
import { ActionItemList } from '../components/dashboard/ActionItemList';
import { useAuthStore } from '../store/authStore';
import { CATEGORY_LABELS } from '../utils/categoryColors';
import { Calendar, TrendingUp, Sparkles } from 'lucide-react';

const CATEGORY_DOT_COLORS: Record<string, string> = {
  ASSIGNMENT:   '#818cf8', ATTENDANCE:   '#f87171',
  HACKATHON:    '#fb923c', PLACEMENT:    '#34d399',
  INTERNSHIP:   '#2dd4bf', MEETING:      '#c084fc',
  ANNOUNCEMENT: '#fbbf24', RESEARCH:     '#22d3ee',
  FINANCE:      '#4ade80', PERSONAL:     '#f472b6',
  PROMOTIONAL:  '#94a3b8', SPAM:         '#ef4444',
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.getSummary,
    refetchInterval: 300_000,
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <AppShell
      title="Dashboard"
      subtitle={`${greeting}, ${firstName} — here's what matters today`}
    >
      <div className="p-5 space-y-6">
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Quick Stats */}
            <div className="animate-fade-in">
              <QuickStats
                unreadCount={data?.unreadCount ?? 0}
                upcomingDeadlines={data?.upcomingDeadlines?.length ?? 0}
                pendingActions={data?.pendingActions?.length ?? 0}
                categoryCounts={data?.categoryCounts ?? {}}
              />
            </div>

            {/* Category overview */}
            {Object.keys(data?.categoryCounts ?? {}).length > 0 && (
              <div className="animate-fade-in delay-100">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-indigo-400" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Category Breakdown</p>
                </div>
                <div className="glass rounded-2xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(data?.categoryCounts ?? {}).map(([cat, count]) => (
                      <button
                        key={cat}
                        onClick={() => navigate(`/inbox?category=${cat}`)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 hover:brightness-125"
                        style={{
                          background: `${CATEGORY_DOT_COLORS[cat] ?? '#94a3b8'}12`,
                          border: `1px solid ${CATEGORY_DOT_COLORS[cat] ?? '#94a3b8'}25`,
                          color: CATEGORY_DOT_COLORS[cat] ?? '#94a3b8',
                        }}
                        title={`View ${(CATEGORY_LABELS as Record<string, string>)[cat] ?? cat} emails`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: CATEGORY_DOT_COLORS[cat] ?? '#94a3b8' }}
                        />
                        {(CATEGORY_LABELS as Record<string, string>)[cat] ?? cat}
                        <strong className="text-white/90">{count as number}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in delay-200">
              <PriorityFeed emails={data?.priorityEmails ?? []} />

              {/* Deadlines */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Calendar size={14} className="text-red-400" />
                  <h3 className="font-bold text-white text-sm">Upcoming Deadlines</h3>
                  <span className="ml-auto text-xs text-slate-600 font-medium">Next 7 days</span>
                </div>
                {(data?.upcomingDeadlines?.length ?? 0) === 0 ? (
                  <div className="glass-sm rounded-2xl p-8 text-center">
                    <div className="text-3xl mb-2">🎉</div>
                    <p className="text-slate-500 text-sm font-medium">No upcoming deadlines</p>
                    <p className="text-slate-600 text-xs mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data?.upcomingDeadlines?.map((email: any, i: number) => (
                      <div key={email.id} className={`animate-fade-in delay-${(i + 1) * 50}`}>
                        <DeadlineCard email={email} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <ActionItemList actions={data?.pendingActions ?? []} />
            </div>

            {/* Today's meetings */}
            {(data?.todaysMeetings?.length ?? 0) > 0 && (
              <div className="animate-fade-in delay-300">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-violet-400" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Today's Meetings</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data?.todaysMeetings?.map((email: any) => (
                    <DeadlineCard key={email.id} email={email} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
};

const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 skeleton rounded-2xl" />
      ))}
    </div>
    <div className="h-16 skeleton rounded-2xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-64 skeleton rounded-2xl" />
      ))}
    </div>
  </div>
);
