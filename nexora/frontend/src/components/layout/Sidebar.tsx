import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Sparkles, BarChart2, Bell, Settings, RefreshCw
} from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useEmails } from '../../hooks/useEmails';
import { CAT_COLORS } from '../../utils/catColors';

interface SidebarProps {
  collapsed: boolean;
}

const NAV_ITEMS = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inbox',         icon: Inbox,           label: 'Inbox', isInbox: true },
  { to: '/brain',         icon: Sparkles,        label: 'Nexora Brain' },
  { to: '/analytics',     icon: BarChart2,       label: 'Analytics' },
  { to: '/notifications', icon: Bell,            label: 'Notifications', isNotif: true },
  { to: '/settings',      icon: Settings,        label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount: unreadNotifCount } = useNotificationStore();
  const { sync, isSyncing, categoryCounts, emails } = useEmails();

  const unreadEmailCount = emails.filter(e => !e.isRead).length;

  return (
    <aside
      style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        minWidth: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        background: 'var(--bg)',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        userSelect: 'none',
        paddingTop: 12,
      }}
    >
      <div style={{ padding: collapsed ? '0 12px 16px' : '0 16px 16px' }}>
        <button
          onClick={() => sync()}
          disabled={isSyncing}
          className="btn-gmail-compose"
          style={{
            width: collapsed ? 48 : '100%',
            height: collapsed ? 48 : 56,
            borderRadius: collapsed ? '50%' : 16,
            padding: collapsed ? 0 : '0 20px',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          title="Sync Gmail inbox"
        >
          <RefreshCw size={20} style={{ color: 'var(--accent)' }} className={isSyncing ? 'animate-spin' : ''} />
          {!collapsed && (
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
                {isSyncing ? 'Syncing...' : 'Sync Gmail'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                Fetch latest AI emails
              </div>
            </div>
          )}
        </button>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label, isInbox, isNotif }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
          const badgeCount = isInbox ? unreadEmailCount : isNotif ? unreadNotifCount : 0;

          if (collapsed) {
            return (
              <Link
                key={to}
                to={to}
                className={`gmail-nav-item-collapsed${isActive ? ' active' : ''}`}
                title={label}
              >
                <Icon size={20} />
              </Link>
            );
          }

          return (
            <Link
              key={to}
              to={to}
              className={`gmail-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {label}
              </span>
              {badgeCount > 0 && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isActive ? 'var(--accent)' : 'var(--text-1)',
                    fontFamily: 'Google Sans, Roboto, sans-serif',
                  }}
                >
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div style={{ marginTop: 24, padding: '0 16px 0 24px', flex: 1, overflowY: 'auto' }}>
          <p className="section-label" style={{ margin: '0 0 8px' }}>
            CATEGORIES
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.keys(CAT_COLORS).map(cat => {
              const cfg = CAT_COLORS[cat];
              const count = categoryCounts[cat] ?? 0;
              const isCatActive = location.pathname === '/inbox' && location.search.includes(`category=${cat}`);

              return (
                <div
                  key={cat}
                  onClick={() => navigate(`/inbox?category=${cat}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    height: 32,
                    padding: '0 12px 0 8px',
                    borderRadius: 16,
                    cursor: 'pointer',
                    background: isCatActive ? 'var(--surface-2)' : 'transparent',
                    color: isCatActive ? 'var(--text-1)' : 'var(--text-2)',
                    fontSize: 13,
                    fontWeight: isCatActive ? 700 : 400,
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={e => { if (!isCatActive) (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; }}
                  onMouseLeave={e => { if (!isCatActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: cfg.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cfg.label}
                  </span>
                  {count > 0 && (
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      {count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
