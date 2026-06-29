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
      <div className="fixed inset-0 z-40" onClick={togglePanel} />

      {/* Panel */}
      <div
        className="fixed right-4 top-16 w-96 max-h-[80vh] z-50 flex flex-col animate-scale-in origin-top-right"
        style={{
          background: 'var(--panel-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.2), 0 0 0 1px var(--border-color)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3.5 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <Bell size={13} className="text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}
              >
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all duration-200"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a5b4fc'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
                title="Mark all read"
              >
                <CheckCheck size={11} /> All read
              </button>
            )}
            <button
              onClick={togglePanel}
              className="p-1.5 text-slate-600 hover:text-white hover:bg-white/6 rounded-lg transition-all duration-200"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {notifications.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-3xl mb-3">🔔</div>
              <p className="text-slate-400 font-semibold text-sm">All caught up!</p>
              <p className="text-slate-600 text-xs mt-1">No new notifications right now.</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div
            className="px-4 py-3 border-t flex-shrink-0"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              onClick={() => { togglePanel(); navigate('/notifications'); }}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-200 w-full justify-center"
            >
              View all notifications <ExternalLink size={11} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
