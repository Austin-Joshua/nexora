import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../../api/notificationApi';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationItem } from './NotificationItem';
import { Bell, X, CheckCheck, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationPanel: React.FC = () => {
  const { notifications, setNotifications, isPanelOpen, togglePanel, markAllRead } = useNotificationStore();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.getNotifications,
    enabled: isPanelOpen,
  });

  useEffect(() => {
    if (data) setNotifications(data);
  }, [data]);

  if (!isPanelOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={togglePanel} />

      {/* Panel */}
      <div
        className="animate-scale-in"
        style={{
          position: 'absolute',
          right: 0,
          top: 36,
          width: 320,
          maxHeight: 400,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--s2)',
          border: '1px solid var(--border-b)',
          borderRadius: 8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 5,
                background: 'rgba(240,192,48,0.12)',
                border: '1px solid rgba(240,192,48,0.20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={12} style={{ color: '#f0c030' }} />
            </div>
            <span className="section-label">ALERTS</span>
            {unreadCount > 0 && (
              <span
                style={{
                  padding: '1px 5px',
                  background: 'rgba(240,192,48,0.12)',
                  border: '1px solid rgba(240,192,48,0.25)',
                  borderRadius: 9999,
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#f0c030',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--t3)',
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '2px 4px',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#40c070'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--t3)'}
                title="Mark all read"
              >
                <CheckCheck size={11} /> Read all
              </button>
            )}
            <button
              onClick={togglePanel}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--t3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 20,
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--t1)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--t3)'}
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>🔔</div>
              <p style={{ color: 'var(--t2)', fontSize: 11, fontWeight: 600, margin: '0 0 2px' }}>All caught up!</p>
              <p style={{ color: 'var(--t3)', fontSize: 9, margin: 0 }}>No alerts right now</p>
            </div>
          ) : (
            notifications.slice(0, 5).map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div
            style={{
              padding: '8px 12px',
              borderTop: '1px solid var(--border)',
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => { togglePanel(); navigate('/notifications'); }}
              className="btn-outline-blue"
              style={{
                width: '100%',
                justifyContent: 'center',
                fontSize: 10,
                padding: '4px 0',
              }}
            >
              View all notifications <ExternalLink size={10} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
