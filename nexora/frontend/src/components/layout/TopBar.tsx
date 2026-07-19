import React, { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon, CheckCircle, RefreshCw } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { useEmails } from '../../hooks/useEmails';
import { useEmailStore } from '../../store/emailStore';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

function useRelativeTime(date: Date | null) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!date) { setLabel(null); return; }
    const update = () => {
      const diffMs = Date.now() - date.getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) setLabel('just now');
      else if (mins === 1) setLabel('1m ago');
      else if (mins < 60) setLabel(`${mins}m ago`);
      else {
        const hrs = Math.floor(mins / 60);
        setLabel(hrs === 1 ? '1h ago' : `${hrs}h ago`);
      }
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [date]);

  return label;
}

export const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  const { unreadCount, togglePanel, isPanelOpen } = useNotificationStore();
  const { sync, isSyncing } = useEmails();
  const { setSearchQuery, searchQuery, lastSyncedAt } = useEmailStore();
  const [searchFocused, setSearchFocused] = useState(false);
  const lastSyncLabel = useRelativeTime(lastSyncedAt);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <header
      style={{
        height: 48,
        background: '#060a0f',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Left: Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', margin: 0, lineHeight: 1 }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: 11, color: 'var(--t3)', margin: 0, marginTop: 2, lineHeight: 1 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Expandable search */}
        <div
          style={{
            position: 'relative',
            width: searchFocused ? 160 : 36,
            transition: 'width 0.25s ease',
          }}
        >
          <Search
            size={13}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--t3)',
              pointerEvents: 'none',
            }}
          />
          <input
            id="topbar-search"
            type="text"
            placeholder={searchFocused ? 'Search emails...' : ''}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              height: 30,
              background: 'var(--s1)',
              border: '1px solid var(--border)',
              borderRadius: 7,
              paddingLeft: 30,
              paddingRight: 8,
              fontSize: 11,
              color: 'var(--t1)',
              outline: 'none',
              transition: 'border-color 0.15s ease',
              ...(searchFocused ? { borderColor: 'rgba(79,158,255,0.45)' } : {}),
            }}
          />
        </div>

        {/* Sync status badge */}
        {isSyncing ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 9999,
              background: 'rgba(79,158,255,0.10)',
              border: '1px solid rgba(79,158,255,0.20)',
              color: 'var(--blue)',
              fontSize: 9,
              fontFamily: 'JetBrains Mono, monospace',
              whiteSpace: 'nowrap',
              cursor: 'default',
            }}
          >
            <RefreshCw size={8} className="animate-spin" />
            Syncing...
          </span>
        ) : lastSyncLabel ? (
          <button
            id="sync-btn"
            onClick={() => sync()}
            title="Click to sync"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 9999,
              background: 'rgba(64,192,112,0.10)',
              border: '1px solid rgba(64,192,112,0.20)',
              color: '#40c070',
              fontSize: 9,
              fontFamily: 'JetBrains Mono, monospace',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            <CheckCircle size={8} />
            ✓ Synced {lastSyncLabel}
          </button>
        ) : null}

        {/* Theme toggle */}
        <button
          id="theme-toggle"
          onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: 'transparent',
            border: 'none',
            color: 'var(--t3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--t1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--t3)'; }}
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </button>

        {/* Bell with red dot */}
        <div style={{ position: 'relative' }}>
          <button
            id="notifications-btn"
            onClick={togglePanel}
            title="Notifications"
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              background: isPanelOpen ? 'rgba(240,192,48,0.10)' : 'transparent',
              border: isPanelOpen ? '1px solid rgba(240,192,48,0.22)' : 'none',
              color: isPanelOpen ? 'var(--gold)' : 'var(--t3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              if (!isPanelOpen) {
                (e.currentTarget as HTMLElement).style.color = 'var(--t1)';
              }
            }}
            onMouseLeave={e => {
              if (!isPanelOpen) {
                (e.currentTarget as HTMLElement).style.color = 'var(--t3)';
              }
            }}
          >
            <Bell size={14} />
            {unreadCount > 0 && (
              <span
                className="animate-scale-in"
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#f05050',
                }}
              />
            )}
          </button>
          <NotificationPanel />
        </div>
      </div>
    </header>
  );
};
