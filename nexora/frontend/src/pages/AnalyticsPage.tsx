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
import { CATEGORY_LABELS } from '../utils/categoryColors';
import { BarChart2, TrendingUp, Users, Mail, Sparkles } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  ASSIGNMENT:   '#818cf8', ATTENDANCE:   '#f87171',
  HACKATHON:    '#fb923c', PLACEMENT:    '#34d399',
  INTERNSHIP:   '#2dd4bf', MEETING:      '#c084fc',
  ANNOUNCEMENT: '#fbbf24', RESEARCH:     '#22d3ee',
  FINANCE:      '#4ade80', PERSONAL:     '#f472b6',
  PROMOTIONAL:  '#94a3b8', SPAM:         '#ef4444',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-lg"
      style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.3)' }}
    >
      {label && <p className="text-slate-400 mb-1">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color ?? entry.fill ?? '#a5b4fc' }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}> = ({ icon, label, value, sub, color }) => (
  <div
    className="glass rounded-2xl p-5 flex items-center gap-4 animate-fade-in"
    style={{ border: `1px solid ${color}20` }}
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}15`, border: `1px solid ${color}25`, color }}
    >
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.getSummary,
    staleTime: 120_000,
  });

  const { data: emailPage, isLoading: emailsLoading } = useQuery({
    queryKey: ['analytics-emails'],
    queryFn: () => emailApi.getEmails({ size: 50 }),
    staleTime: 120_000,
  });

  const { data: senders, isLoading: sendersLoading } = useQuery({
    queryKey: ['senders'],
    queryFn: emailApi.getSenderSummary,
    staleTime: 120_000,
  });

  const isLoading = summaryLoading || emailsLoading || sendersLoading;

  // --- Category donut data ---
  const categoryData = useMemo(() => {
    if (!summary?.categoryCounts) return [];
    return Object.entries(summary.categoryCounts).map(([cat, count]) => ({
      name: (CATEGORY_LABELS as Record<string, string>)[cat] ?? cat,
      value: count as number,
      color: CATEGORY_COLORS[cat] ?? '#94a3b8',
      raw: cat,
    }));
  }, [summary]);

  // --- Email volume by day (last 7 days) ---
  const volumeData = useMemo(() => {
    const emails = emailPage?.content ?? [];
    const dayCounts: Record<string, number> = {};
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    days.forEach((d) => (dayCounts[d] = 0));
    emails.forEach((e) => {
      if (!e.receivedAt) return;
      const label = new Date(e.receivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (label in dayCounts) dayCounts[label] = (dayCounts[label] ?? 0) + 1;
    });
    return days.map((d) => ({ day: d, emails: dayCounts[d] ?? 0 }));
  }, [emailPage]);

  // --- Priority breakdown ---
  const priorityData = useMemo(() => {
    const emails = emailPage?.content ?? [];
    const counts: Record<string, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    emails.forEach((e) => { if (e.priority && counts[e.priority] !== undefined) counts[e.priority]++; });
    return [
      { name: 'High', value: counts.HIGH, color: '#f87171' },
      { name: 'Medium', value: counts.MEDIUM, color: '#fbbf24' },
      { name: 'Low', value: counts.LOW, color: '#4ade80' },
    ].filter(d => d.value > 0);
  }, [emailPage]);

  const totalEmails = (emailPage?.totalElements ?? 0);
  const unreadCount = summary?.unreadCount ?? 0;
  const topSenders = (senders ?? []).slice(0, 5);

  if (isLoading) {
    return (
      <AppShell title="Analytics" subtitle="Insights into your inbox">
        <div className="p-5 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => <div key={i} className="h-64 skeleton rounded-2xl" />)}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Analytics" subtitle="Insights into your inbox patterns">
      <div className="p-5 space-y-6 max-w-6xl mx-auto">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          <StatCard icon={<Mail size={20} />} label="Total Emails" value={totalEmails} color="#818cf8" />
          <StatCard icon={<Sparkles size={20} />} label="Unread" value={unreadCount} sub="in your inbox" color="#fb923c" />
          <StatCard icon={<Users size={20} />} label="Unique Senders" value={senders?.length ?? 0} color="#34d399" />
          <StatCard icon={<TrendingUp size={20} />} label="Categories" value={categoryData.length} sub="detected" color="#c084fc" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Category Donut */}
          <div className="glass rounded-2xl p-5 animate-fade-in delay-100">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={14} className="text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Category Distribution</h3>
              <span className="ml-auto text-[10px] text-slate-600 font-medium">Click pill → inbox</span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    onClick={(_data, index) => {
                      const item = categoryData[index];
                      if (item) navigate(`/inbox?category=${item.raw}`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-3">
              {categoryData.map((d) => (
                <button
                  key={d.raw}
                  onClick={() => navigate(`/inbox?category=${d.raw}`)}
                  className="flex items-center gap-1.5 text-[10px] font-semibold rounded-lg px-2 py-1 transition-all duration-150 hover:scale-105"
                  style={{
                    background: `${d.color}15`,
                    border: `1px solid ${d.color}30`,
                    color: d.color,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  {d.name}
                  <strong className="text-white/80 ml-0.5">{d.value}</strong>
                </button>
              ))}
            </div>
          </div>

          {/* Email Volume Line Chart */}
          <div className="glass rounded-2xl p-5 animate-fade-in delay-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Email Volume — Last 7 Days</h3>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="emails"
                    name="Emails"
                    stroke="#818cf8"
                    strokeWidth={2}
                    dot={{ fill: '#818cf8', r: 4 }}
                    activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Priority + Top Senders row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Priority Breakdown Bar */}
          <div className="glass rounded-2xl p-5 animate-fade-in delay-300">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-violet-400" />
              <h3 className="text-sm font-bold text-white">Priority Breakdown</h3>
            </div>
            {priorityData.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-600 text-sm">No priority data yet</div>
            ) : (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
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
          <div className="glass rounded-2xl p-5 animate-fade-in delay-300">
            <div className="flex items-center gap-2 mb-4">
              <Users size={14} className="text-teal-400" />
              <h3 className="text-sm font-bold text-white">Top Senders</h3>
              <button
                onClick={() => navigate('/inbox?category=SENDERS')}
                className="ml-auto text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                View all →
              </button>
            </div>
            <div className="space-y-2.5">
              {topSenders.length === 0 ? (
                <div className="text-slate-600 text-sm text-center py-8">No sender data yet</div>
              ) : topSenders.map((sender, i) => {
                const medals = ['🥇', '🥈', '🥉'];
                const initial = (sender.senderName ?? sender.senderEmail ?? '?')[0].toUpperCase();
                const maxCount = topSenders[0].emailCount;
                const pct = maxCount > 0 ? (sender.emailCount / maxCount) * 100 : 0;
                return (
                  <div key={sender.senderEmail} className="flex items-center gap-3">
                    <span className="text-base flex-shrink-0 w-5 text-center">
                      {i < 3 ? medals[i] : <span className="text-xs text-slate-600 font-bold">#{i + 1}</span>}
                    </span>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
                    >
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs font-semibold text-white truncate">
                          {sender.senderName ?? sender.senderEmail}
                        </p>
                        <span className="text-[10px] text-indigo-400 font-bold ml-2 flex-shrink-0">
                          {sender.emailCount}
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-white/5">
                        <div
                          className="h-1 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #7c3aed)' }}
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
