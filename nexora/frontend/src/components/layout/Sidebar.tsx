import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Brain, Bell, Settings, LogOut, Zap, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationStore } from '../../store/notificationStore';

const NAV_ITEMS = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard',      color: 'text-indigo-400' },
  { to: '/inbox',         icon: Inbox,           label: 'Inbox',           color: 'text-blue-400' },
  { to: '/brain',         icon: Brain,           label: 'Nexora Brain',    color: 'text-violet-400' },
  { to: '/notifications', icon: Bell,            label: 'Notifications',   color: 'text-amber-400' },
  { to: '/settings',      icon: Settings,        label: 'Settings',        color: 'text-slate-400' },
];

const ROLE_COLORS: Record<string, string> = {
  STUDENT:         'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  PROFESSOR:       'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  IT_EMPLOYEE:     'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  HR_PROFESSIONAL: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  MANAGER:         'text-rose-400 bg-rose-500/10 border-rose-500/20',
  FREELANCER:      'text-teal-400 bg-teal-500/10 border-teal-500/20',
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const { unreadCount } = useNotificationStore();
  const roleClass = ROLE_COLORS[user?.userRole ?? ''] ?? ROLE_COLORS.STUDENT;

  return (
    <aside
      className="w-64 h-screen flex flex-col flex-shrink-0 border-r border-white/6 relative"
      style={{
        background: 'var(--sidebar-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-4 right-4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)' }}
      />

      {/* Logo */}
      <div className="p-5 border-b border-white/6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 animate-glow"
            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
          >
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-white text-[17px] leading-none tracking-tight">Nexora</h1>
            <p className="text-[10px] text-indigo-400 font-medium mt-0.5 tracking-wide">Intelligence Layer</p>
          </div>
        </div>
      </div>

      {/* Role badge */}
      {user && (
        <div className="px-4 py-3 border-b border-white/6">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${roleClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-soft flex-shrink-0" />
            <span className="text-xs font-semibold tracking-wide truncate">
              {user.userRole.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label, color }, index) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
          const isNotif = to === '/notifications';
          return (
            <Link
              key={to}
              to={to}
              id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`nav-item group animate-fade-in delay-${(index + 1) * 50} ${isActive ? 'active' : ''}`}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-all duration-200 ${
                  isActive ? 'text-indigo-400' : `${color} group-hover:scale-110`
                }`}
              />
              <span className="flex-1 text-sm font-medium">{label}</span>
              {isNotif && unreadCount > 0 && (
                <span
                  className="flex-shrink-0 min-w-[20px] h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 animate-scale-in"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              {isActive && (
                <ChevronRight size={12} className="text-indigo-400 flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="divider mx-3" />

      {/* User profile */}
      {user && (
        <div className="p-3">
          <div className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-white/4 transition-all duration-200 cursor-pointer group">
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt="avatar"
                className="w-8 h-8 rounded-full ring-2 ring-white/10 group-hover:ring-indigo-500/40 transition-all duration-200 flex-shrink-0"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
              >
                {user.name[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">{user.name}</p>
              <p className="text-xs text-slate-500 truncate leading-tight mt-0.5">{user.email}</p>
            </div>
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 flex-shrink-0"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)' }}
      />
    </aside>
  );
};
