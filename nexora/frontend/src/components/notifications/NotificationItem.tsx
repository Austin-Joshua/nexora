import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../../types/Notification';
import { notificationApi } from '../../api/notificationApi';
import { useNotificationStore } from '../../store/notificationStore';
import { formatRelative } from '../../utils/formatDate';
import { Bell, Clock, Mail, CheckCircle, Check, ArrowRight } from 'lucide-react';

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  DEADLINE: {
    icon: <Clock size={12} />,
    color: '#f05050',
    bg: 'rgba(240,80,80,0.12)',
    border: 'rgba(240,80,80,0.25)',
  },
  ACTION_REQUIRED: {
    icon: <CheckCircle size={12} />,
    color: '#f0c030',
    bg: 'rgba(240,192,48,0.12)',
    border: 'rgba(240,192,48,0.25)',
  },
  IMPORTANT_EMAIL: {
    icon: <Mail size={12} />,
    color: '#4f9eff',
    bg: 'rgba(79,158,255,0.12)',
    border: 'rgba(79,158,255,0.25)',
  },
  DAILY_DIGEST: {
    icon: <Bell size={12} />,
    color: '#7890a8',
    bg: 'rgba(120,144,168,0.12)',
    border: 'rgba(120,144,168,0.25)',
  },
};

const DEFAULT_CONFIG = TYPE_CONFIG.DAILY_DIGEST;

interface Props {
  notification: Notification;
}

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
    if (!notification.isRead) {
      try {
        await notificationApi.markRead(notification.id);
        markRead(notification.id);
      } catch {}
    }
    if (notification.relatedEmailId) {
      navigate(`/inbox?emailId=${notification.relatedEmailId}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        background: notification.isRead ? 'transparent' : 'var(--s1)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        cursor: notification.relatedEmailId ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'var(--s2)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-b)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = notification.isRead ? 'transparent' : 'var(--s1)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
      }}
    >
      {/* Unread status bar */}
      {!notification.isRead && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: '#f0c030',
            borderRadius: '3px 0 0 3px',
          }}
        />
      )}

      {/* Type Icon */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          color: cfg.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {cfg.icon}
      </div>

      {/* Text Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: notification.isRead ? 600 : 700,
              color: notification.isRead ? 'var(--t2)' : 'var(--t1)',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {notification.title}
          </p>
          <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
            {formatRelative(notification.createdAt)}
          </span>
        </div>
        <p
          style={{
            fontSize: 11,
            color: notification.isRead ? 'var(--t3)' : 'var(--t2)',
            margin: 0,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {notification.message}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {!notification.isRead && (
          <button
            onClick={handleMarkRead}
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--t3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#40c070';
              (e.currentTarget as HTMLElement).style.color = '#40c070';
              (e.currentTarget as HTMLElement).style.background = 'rgba(64,192,112,0.10)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.color = 'var(--t3)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
            title="Mark read"
          >
            <Check size={11} />
          </button>
        )}
        {notification.relatedEmailId && (
          <ArrowRight size={11} style={{ color: 'var(--t3)' }} />
        )}
      </div>
    </div>
  );
};
