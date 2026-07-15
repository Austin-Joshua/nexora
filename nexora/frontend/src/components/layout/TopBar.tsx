import React, { useState, useEffect } from 'react';
import { Bell, RefreshCw, Search, X, Sun, Moon, Menu, Clock } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { useEmails } from '../../hooks/useEmails';
import { useEmailStore } from '../../store/emailStore';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
}

function useRelativeTime(date: Date | null) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!date) { setLabel(null); return; }

    const update = () => {
      const diffMs = Date.now() - date.getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) setLabel('just now');
      else if (mins === 1) setLabel('1 min ago');
      else if (mins < 60) setLabel(`${mins} mins ago`);
      else {
        const hrs = Math.floor(mins / 60);
        setLabel(hrs === 1 ? '1 hr ago' : `${hrs} hrs ago`);
      }
    };

    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [date]);

  return label;
}

export const TopBar: React.FC<TopBarProps> = ({ title, subtitle, onMenuToggle }) => {
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

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      className="h-14 border-b border-white/6 flex items-center justify-between px-5 flex-shrink-0 relative"
      style={{
        background: 'var(--topbar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Left: Title & Mobile menu button */}
      <div className="animate-fade-in flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-slate-500 hover:text-white rounded-xl transition-all duration-200 hover:bg-white/5"
            title="Open navigation"
          >
            <Menu size={16} />
          </button>
        )}
        <div>
          <h2 className="text-[15px] font-bold text-white leading-none tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 font-medium leading-none">{subtitle}</p>
          )}
        </div>
        {/* Last synced indicator */}
        {lastSyncLabel && (
          <div
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#6ee7b7' }}
          >
            <Clock size={9} />
            Synced {lastSyncLabel}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className={`relative transition-all duration-300 ${searchFocused ? 'w-56' : 'w-44'}`}>
          <Search
            size={13}
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
              searchFocused ? 'text-indigo-400' : 'text-slate-600'
            }`}
          />
          <input
            id="topbar-search"
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none transition-all duration-300"
            style={{
              background: searchFocused ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
              border: searchFocused ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.07)',
              boxShadow: searchFocused ? '0 0 0 3px rgba(99,102,241,0.08)' : 'none',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
            >
              <X size={11} />
            </button>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-white rounded-xl transition-all duration-200 hover:bg-white/5"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        {/* Sync button */}
        <button
          id="sync-btn"
          onClick={() => sync()}
          disabled={isSyncing}
          className="p-2 text-slate-500 hover:text-white rounded-xl transition-all duration-200 hover:bg-white/5 disabled:opacity-40 relative group"
          title="Sync inbox"
        >
          <RefreshCw
            size={15}
            className={`transition-all duration-300 ${isSyncing ? 'animate-spin text-indigo-400' : 'group-hover:rotate-180'}`}
          />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={togglePanel}
            className={`p-2 rounded-xl transition-all duration-200 relative ${
              isPanelOpen
                ? 'bg-indigo-500/15 text-indigo-400 shadow-md shadow-indigo-900/20'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
            title="Notifications"
          >
            <Bell size={15} className={isPanelOpen ? 'animate-pulse-soft' : ''} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center px-0.5 animate-scale-in"
                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 2px 8px rgba(99,102,241,0.5)' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel />
        </div>
      </div>
    </header>
  );
};
