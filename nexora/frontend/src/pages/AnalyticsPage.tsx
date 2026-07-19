import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import { AppShell } from '../components/layout/AppShell';
import { emailApi } from '../api/emailApi';
import { dashboardApi } from '../api/dashboardApi';
import { CAT_COLORS, CATEGORY_LABELS } from '../utils/catColors';
import { BarChart2, Users, Mail, Sparkles } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--s2)',
        border: '1px solid var(--border-b)',
        borderRadius: 6,
        padding: '6px 10px',
        fontSize: 11,
      }}
    >
      {label && <p style={{ color: 'var(--t3)', margin: '0 0 4px', fontFamily: 'JetBrains Mono, monospace' }}>{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color ?? entry.fill ?? 'var(--gold)', margin: 0, fontWeight: 600 }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.getSummary,
    staleTime: 120_000,
  });

  const { data: emailPage, isLoading: emailsLoading } = useQuery({
    queryKey: ['analytics-emails'],
    queryFn: () => emailApi.getEmails({ size: 100 }),
    staleTime: 120_000,
  });

  const { data: senders, isLoading: sendersLoading } = useQuery({
    queryKey: ['senders'],
    queryFn: emailApi.getSenderSummary,
    staleTime: 120_000,
  });

  // C.3 — Fetch real email volume from the backend route
  const { data: volumeHistory, isLoading: volumeLoading } = useQuery({
    queryKey: ['email-volume'],
    queryFn: () => dashboardApi.getEmailVolume(7),
    staleTime: 120_000,
  });

  const isLoading = summaryLoading || emailsLoading || sendersLoading || volumeLoading;

  // --- Category donut data ---
  const categoryData = useMemo(() => {
    if (!summary?.categoryCounts) return [];
    return Object.entries(summary.categoryCounts).map(([cat, count]) => ({
      name: CATEGORY_LABELS[cat] ?? cat,
      value: count as number,
      color: CAT_COLORS[cat]?.color ?? '#3d5570',
      raw: cat,
    }));
  }, [summary]);

  // --- Format volume history dates for LineChart ---
  const formattedVolumeData = useMemo(() => {
    if (!volumeHistory) return [];
    return volumeHistory.map(pt => {
      // format "2026-07-19" into "Jul 19"
      try {
        const parts = pt.date.split('-');
        if (parts.length === 3) {
          const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          return {
            day: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            emails: pt.count,
          };
        }
      } catch {}
      return { day: pt.date, emails: pt.count };
    });
  }, [volumeHistory]);

  // --- Priority breakdown ---
  const priorityData = useMemo(() => {
    const emails = emailPage?.content ?? [];
    const counts: Record<string, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    emails.forEach((e) => {
      if (e.priority && counts[e.priority] !== undefined) counts[e.priority]++;
    });
    return [
      { name: 'High', value: counts.HIGH, color: '#f05050' },
      { name: 'Medium', value: counts.MEDIUM, color: '#f0c030' },
      { name: 'Low', value: counts.LOW, color: '#40c070' },
    ].filter(d => d.value > 0);
  }, [emailPage]);

  const totalEmails = emailPage?.totalElements ?? 0;
  const unreadCount = summary?.unreadCount ?? 0;
  const topSenders = (senders ?? []).slice(0, 5);

  if (isLoading) {
    return (
      <AppShell title="Analytics" subtitle="Insights into your email patterns">
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }} className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 88 }} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: 260 }} />)}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Analytics" subtitle="Insights into your email patterns and volumes">
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* ROW 1: 4 Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }} className="animate-fade-in">
          <StatCard label="Total Emails" value={totalEmails} accentColor="#4f9eff" icon={Mail} sub="synced overall" />
          <StatCard label="Unread Attention" value={unreadCount} accentColor="#f05050" icon={Sparkles} sub="pending read" />
          <StatCard label="Active Senders" value={senders?.length ?? 0} accentColor="#40c070" icon={Users} sub="unique contacts" />
          <StatCard label="Categories" value={categoryData.length} accentColor="#f0c030" icon={BarChart2} sub="classes found" />
        </div>

        {/* ROW 2: Distribution & Volume */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
          {/* Category Pie Chart */}
          <div className="surface" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="section-label">CATEGORY DISTRIBUTION</span>
              <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>Click segment to view</span>
            </div>
            <div style={{ height: 180, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={(_data, index) => {
                      const item = categoryData[index];
                      if (item) navigate(`/inbox?category=${item.raw}`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="var(--bg)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {categoryData.map((d) => (
                <button
                  key={d.raw}
                  onClick={() => navigate(`/inbox?category=${d.raw}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 8px',
                    background: d.color + '12',
                    border: `1px solid ${d.color}22`,
                    borderRadius: 5,
                    color: d.color,
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = d.color + '22';
                    (e.currentTarget as HTMLElement).style.borderColor = d.color + '40';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = d.color + '12';
                    (e.currentTarget as HTMLElement).style.borderColor = d.color + '22';
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: d.color }} />
                  {d.name}
                  <span style={{ color: 'var(--t1)', opacity: 0.8 }}>{d.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email Volume over 7 days */}
          <div className="surface" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="section-label">EMAIL VOLUME (LAST 7 DAYS)</span>
            <div style={{ height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedVolumeData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 9, fill: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="emails"
                    name="Emails"
                    stroke="#4f9eff"
                    strokeWidth={2}
                    dot={{ fill: '#4f9eff', r: 3 }}
                    activeDot={{ r: 5, fill: '#4f9eff', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 3: Priority & Senders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 10 }}>
          {/* Priority Breakdown */}
          <div className="surface" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="section-label">PRIORITY BREAKDOWN</span>
            {priorityData.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, color: 'var(--t3)', fontSize: 12 }}>
                No priority data available
              </div>
            ) : (
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Emails" radius={[4, 4, 0, 0]}>
                      {priorityData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Top Senders */}
          <div className="surface" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="section-label">TOP SENDERS</span>
              <button
                onClick={() => navigate('/inbox?category=SENDERS')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4f9eff',
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                View all Senders →
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topSenders.length === 0 ? (
                <div style={{ color: 'var(--t3)', fontSize: 12, textAlign: 'center', padding: 32 }}>No sender data available</div>
              ) : topSenders.map((sender, i) => {
                const initial = (sender.senderName ?? sender.senderEmail ?? '?')[0].toUpperCase();
                const maxCount = topSenders[0].emailCount;
                const pct = maxCount > 0 ? (sender.emailCount / maxCount) * 100 : 0;
                return (
                  <div key={sender.senderEmail} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--t3)', width: 16 }}>
                      #{i + 1}
                    </span>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: 'rgba(79,158,255,0.12)',
                        border: '1px solid rgba(79,158,255,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 800,
                        color: '#4f9eff',
                        flexShrink: 0,
                      }}
                    >
                      {initial}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {sender.senderName ?? sender.senderEmail}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#4f9eff', fontFamily: 'JetBrains Mono, monospace' }}>
                          {sender.emailCount}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: 3, background: 'var(--border)', borderRadius: 99 }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: '#4f9eff',
                            borderRadius: 99,
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
