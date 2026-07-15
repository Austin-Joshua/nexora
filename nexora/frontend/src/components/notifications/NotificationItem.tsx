import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../../types/Notification';
import { notificationApi } from '../../api/notificationApi';
import { useNotificationStore } from '../../store/notificationStore';
import { formatRelative } from '../../utils/formatDate';
import { Bell, Clock, Mail, CheckCircle, Check, ArrowRight } from 'lucide-react';

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  DEADLINE: {
    icon: <Clock size={13} />,
    color: '#fca5a5',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.2)',
  },
  ACTION_REQUIRED: {
    icon: <CheckCircle size={13} />,
    color: '#fde047',
    bg: 'rgba(234,179,8,0.1)',
    border: 'rgba(234,179,8,0.2)',
  },
  IMPORTANT_EMAIL: {
    icon: <Mail size={13} />,
    color: '#a5b4fc',
    bg: 'rgba(99,102,241,0.1)',
    border: 'rgba(99,102,241,0.2)',
  },
  DAILY_DIGEST: {
    icon: <Bell size={13} />,
    color: '#94a3b8',
    bg: 'rgba(100,116,139,0.1)',
    border: 'rgba(100,116,139,0.15)',
  },
};

const DEFAULT_CONFIG = TYPE_CONFIG.DAILY_DIGEST;

interface Props { notification: Notification; }

export const NotificationItem: React.FC<Props> = ({ notification }) => {
  const { markRead } = useNotificationStore();
  const navigate = useNavigate();
  const cfg = TYPE_CONFIG[notification.notificationType] ?? DEFAULT_CONFIG;

  const handleMarkRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationApi.markRead(notification.id);
      markRead(notification.id);
    } catch {}
  };

  const handleCardClick = async () => {
    // Mark as read silently
    if (!notification.isRead) {
      try {
        await notificationApi.markRead(notification.id);
        markRead(notification.id);
      } catch {}
    }
    // Navigate to related email if available
    if (notification.relatedEmailId) {
      navigate(`/inbox?emailId=${notification.relatedEmailId}`);
    }
  };

  return (
    <div
      role={notification.relatedEmailId ? 'button' : 'article'}
      tabIndex={notification.relatedEmailId ? 0 : undefined}
      className="relative p-4 rounded-2xl transition-all duration-200 group"
      style={{
        background: notification.isRead
          ? 'rgba(255,255,255,0.02)'
          : 'rgba(99,102,241,0.04)',
        border: notification.isRead
          ? '1px solid rgba(255,255,255,0.05)'
          : '1px solid rgba(99,102,241,0.15)',
        cursor: notification.relatedEmailId ? 'pointer' : 'default',
      }}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      onMouseEnter={(e) => {
        if (!notification.isRead) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.07)';
        else if (notification.relatedEmailId) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
      }}
      onMouseLeave={(e) => {
        if (!notification.isRead) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.04)';
        else (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
      }}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{ background: 'linear-gradient(180deg, #6366f1, #7c3aed)' }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
        >
          {cfg.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className={`text-sm font-semibold truncate leading-tight ${notification.isRead ? 'text-slate-500' : 'text-white'}`}>
              {notification.title}
            </p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] text-slate-600 font-medium">
                {formatRelative(notification.createdAt)}
              </span>
              {!notification.isRead && (
                <button
                  onClick={handleMarkRead}
                  className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  title="Mark as read"
                >
                  <Check size={10} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>
          <p className={`text-xs leading-relaxed line-clamp-2 ${notification.isRead ? 'text-slate-600' : 'text-slate-400'}`}>
            {notification.message}
          </p>
          {notification.relatedEmailId && (
            <div className="flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ArrowRight size={10} /> View email
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
