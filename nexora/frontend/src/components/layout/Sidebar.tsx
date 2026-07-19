import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Brain, Bell, Settings, LogOut, Zap, BarChart2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationStore } from '../../store/notificationStore';

const NAV_ITEMS = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inbox',         icon: Inbox,           label: 'Inbox' },
  { to: '/brain',         icon: Brain,           label: 'Nexora Brain' },
  { to: '/analytics',     icon: BarChart2,       label: 'Analytics' },
  { to: '/notifications', icon: Bell,            label: 'Notifications' },
  { to: '/settings',      icon: Settings,        label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { handleLogout } = useAuth();
  const { unreadCount } = useNotificationStore();

  return (
    <aside
      style={{
        width: 52,
        minWidth: 52,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        background: 'var(--s1)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            background: 'var(--gold)',
            borderRadius: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Zap size={17} style={{ color: '#080c12' }} />
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 0',
          gap: 4,
          overflowY: 'auto',
        }}
      >
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
          const isNotif = to === '/notifications';
          return (
            <Link
              key={to}
              to={to}
              id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              title={label}
              className={`nav-btn${isActive ? ' active' : ''}`}
              style={{ position: 'relative' }}
            >
              <Icon size={17} />
              {isNotif && unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#f05050',
                    flexShrink: 0,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        style={{
          padding: '8px 0',
          display: 'flex',
          justifyContent: 'center',
          borderTop: '1px solid var(--border)',
        }}
      >
        <button
          id="logout-btn"
          onClick={handleLogout}
          title="Logout"
          className="nav-btn"
          style={{ border: 'none' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
