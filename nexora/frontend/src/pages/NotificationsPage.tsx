import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { notificationApi } from '../api/notificationApi';
import { useNotificationStore } from '../store/notificationStore';
import { Bell, CheckCheck, Sparkles } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, setNotifications, markAllRead } = useNotificationStore();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications-page'],
    queryFn: notificationApi.getNotifications,
  });

  useEffect(() => {
    if (data) setNotifications(data);
  }, [data]);

  const unread = notifications.filter(n => !n.isRead);
  const read   = notifications.filter(n =>  n.isRead);

  return (
    <AppShell title="Notifications" subtitle="Stay on top of what matters">
      <div className="max-w-5xl mx-auto p-5 space-y-6">

        {/* Header actions */}
        {unread.length > 0 && (
          <div className="flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.22)', color: '#a5b4fc' }}
              >
                {unread.length} new
              </span>
            </div>
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 font-semibold transition-colors duration-200"
            >
              <CheckCheck size={13} /> Mark all read
            </button>
          </div>
        )}

        {isLoading ? (
          <NotificationsSkeleton />
        ) : notifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <>
            {unread.length > 0 && (
              <section className="animate-fade-in">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-1">
                  New ({unread.length})
                </p>
                <div className="space-y-2">
                  {unread.map((n, i) => (
                    <div key={n.id} className={`animate-fade-in delay-${(i + 1) * 50}`}>
                      <NotificationItem notification={n} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {read.length > 0 && (
              <section className="animate-fade-in delay-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-1">Earlier</p>
                <div className="space-y-2 opacity-70">
                  {read.map((n, i) => (
                    <div key={n.id} className={`animate-fade-in delay-${(i + 1) * 50}`}>
                      <NotificationItem notification={n} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
};

const EmptyNotifications: React.FC = () => (
  <div className="text-center py-20 animate-fade-in">
    <div
      className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-5 animate-float"
      style={{
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.15)',
      }}
    >
      <Bell size={32} className="text-indigo-400" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">All caught up!</h3>
    <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
      No notifications yet. Nexora will alert you about deadlines, placements, and important emails.
    </p>
    <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-600">
      <Sparkles size={11} /> AI-powered alerts based on your role
    </div>
  </div>
);

const NotificationsSkeleton: React.FC = () => (
  <div className="space-y-3 animate-fade-in">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 skeleton rounded-2xl" style={{ animationDelay: `${i * 80}ms` }} />
    ))}
  </div>
);
