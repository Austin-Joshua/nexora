import React, { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { Shield, User, Zap, LogOut } from 'lucide-react';

const SECURITY_POINTS = [
  'Gmail access is read-only — Nexora never sends or modifies emails',
  'Gmail tokens encrypted at rest with AES-256',
  'JWT sessions expire automatically after 24 hours',
  'No emails stored in plain text — only AI-processed metadata',
];

function formatSyncTime(dateStr?: string) {
  if (!dateStr) return 'Never';
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins === 1) return '1 minute ago';
    if (mins < 60) return `${mins} minutes ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs === 1) return '1 hour ago';
    return `${hrs} hours ago`;
  } catch {
    return 'Never';
  }
}

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { updateProfile, handleLogout } = useAuth();
  const [calendarSyncEnabled, setCalendarSyncEnabled] = useState(user?.calendarSyncEnabled ?? true);

  const handleCalendarToggle = async (val: boolean) => {
    setCalendarSyncEnabled(val);
    await updateProfile({ calendarSyncEnabled: val });
  };

  return (
    <AppShell title="Settings" subtitle="Manage your Nexora preferences">
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 800, margin: '0 auto', width: '100%' }}>

        {/* Profile Card */}
        <div className="surface">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: 'rgba(79,158,255,0.12)',
                border: '1px solid rgba(79,158,255,0.20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={12} style={{ color: '#4f9eff' }} />
            </div>
            <span className="section-label">PROFILE</span>
          </div>
          <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt="avatar"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                }}
              />
            ) : (
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  background: 'var(--s2)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                  color: 'var(--t1)',
                }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', margin: '0 0 2px' }}>{user?.name}</p>
              <p style={{ fontSize: 11, color: 'var(--t3)', margin: 0 }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Integrations & Sync info */}
        <div className="surface animate-fade-in delay-100">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: 'rgba(240,192,48,0.12)',
                border: '1px solid rgba(240,192,48,0.20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={12} style={{ color: '#f0c030' }} />
            </div>
            <span className="section-label" style={{ flex: 1 }}>INTEGRATIONS</span>
            {user?.lastSyncedAt && (
              <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>
                Last synced: {formatSyncTime(user.lastSyncedAt)}
              </span>
            )}
          </div>
          <div style={{ padding: 16 }}>
            {/* Google Calendar Sync toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <input
                id="calendar-sync-toggle"
                type="checkbox"
                checked={calendarSyncEnabled}
                onChange={e => handleCalendarToggle(e.target.checked)}
                style={{
                  width: 14,
                  height: 14,
                  accentColor: '#f0c030',
                  cursor: 'pointer',
                }}
              />
              <div>
                <label htmlFor="calendar-sync-toggle" style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', cursor: 'pointer' }}>
                  Auto-add deadlines to Google Calendar
                </label>
                <p style={{ fontSize: 10, color: 'var(--t3)', margin: '2px 0 0', lineHeight: 1.4 }}>
                  Nexora will automatically insert detected email deadlines into your Google Calendar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="surface animate-fade-in delay-200">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: 'rgba(64,192,112,0.12)',
                border: '1px solid rgba(64,192,112,0.20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={12} style={{ color: '#40c070' }} />
            </div>
            <span className="section-label">PRIVACY &amp; SECURITY</span>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SECURITY_POINTS.map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#40c070', fontSize: 12, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}

            <div
              style={{
                paddingTop: 14,
                marginTop: 6,
                borderTop: '1px solid var(--border)',
              }}
            >
              <button
                id="revoke-access-btn"
                onClick={handleLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  color: 'var(--high)',
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <LogOut size={12} />
                Revoke access &amp; log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
