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
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 800, margin: '0 auto', width: '100%' }}>

        {/* Header Actions */}
        {unread.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="animate-fade-in">
            <span
              style={{
                padding: '2px 8px',
                background: 'rgba(240,192,48,0.10)',
                border: '1px solid rgba(240,192,48,0.22)',
                borderRadius: 9999,
                fontSize: 10,
                color: '#f0c030',
                fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {unread.length} new
            </span>
            <button
              onClick={markAllRead}
              className="btn-ghost"
              style={{
                padding: '4px 10px',
                fontSize: 10,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <CheckCheck size={11} /> Mark all read
            </button>
          </div>
        )}

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="animate-fade-in">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 52 }} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }} className="animate-fade-in">
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
              className="animate-float"
            >
              <Bell size={24} style={{ color: 'var(--t3)' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', margin: '0 0 6px' }}>All caught up!</h3>
            <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 16px', lineHeight: 1.6, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
              No notifications yet. Nexora will alert you about deadlines, placements, and important emails.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 10, color: 'var(--t3)' }}>
              <Sparkles size={11} /> AI-powered alerts based on your role
            </div>
          </div>
        ) : (
          <>
            {unread.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className="animate-fade-in">
                <span className="section-label">NEW ALERTS</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {unread.map((n, i) => (
                    <div key={n.id} className={`animate-fade-in delay-${(i + 1) * 30}`}>
                      <NotificationItem notification={n} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {read.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className="animate-fade-in delay-100">
                <span className="section-label">EARLIER</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: 0.7 }}>
                  {read.map((n, i) => (
                    <div key={n.id} className={`animate-fade-in delay-${(i + 1) * 30}`}>
                      <NotificationItem notification={n} />
                    </div>
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
