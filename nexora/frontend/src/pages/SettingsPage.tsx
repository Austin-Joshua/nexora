import React, { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types/User';
import { Shield, User, Zap, CheckCircle, LogOut } from 'lucide-react';

const ROLE_OPTIONS: { value: UserRole; label: string; tag: string; desc: string }[] = [
  { value: 'STUDENT',         label: 'Student',         tag: 'STU', desc: 'Assignments, hackathons, placements' },
  { value: 'PROFESSOR',       label: 'Professor',        tag: 'PRF', desc: 'Research, meetings, student queries' },
  { value: 'IT_EMPLOYEE',     label: 'IT Employee',      tag: 'ITE', desc: 'Technical, infra, incident alerts' },
  { value: 'HR_PROFESSIONAL', label: 'HR Professional',  tag: 'HRP', desc: 'Hiring, onboarding, compliance' },
  { value: 'MANAGER',         label: 'Manager',          tag: 'MGR', desc: 'Reports, approvals, team updates' },
  { value: 'FREELANCER',      label: 'Freelancer',       tag: 'FRL', desc: 'Client emails, invoices, deadlines' },
];

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
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.userRole ?? 'STUDENT');
  const [calendarSyncEnabled, setCalendarSyncEnabled] = useState(user?.calendarSyncEnabled ?? true);

  const handleSaveRole = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ role: selectedRole });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCalendarToggle = async (val: boolean) => {
    setCalendarSyncEnabled(val);
    await updateProfile({ calendarSyncEnabled: val });
  };

  const hasChanges = selectedRole !== user?.userRole;

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
              <p style={{ fontSize: 11, color: 'var(--t3)', margin: '0 0 6px' }}>{user?.email}</p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  background: 'rgba(240,192,48,0.10)',
                  border: '1px solid rgba(240,192,48,0.22)',
                  borderRadius: 9999,
                  fontSize: 9,
                  color: '#f0c030',
                  fontWeight: 700,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                <Zap size={9} /> {user?.userRole?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Role selection & Sync info */}
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
            <span className="section-label" style={{ flex: 1 }}>YOUR ROLE</span>
            <span style={{ fontSize: 9, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>Affects prioritization</span>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 14px', lineHeight: 1.6 }}>
              Nexora reads every email and ranks/prioritizes notification cards specifically suited for your role.
              {user?.lastSyncedAt && (
                <span style={{ display: 'block', fontSize: 10, color: 'var(--t3)', marginTop: 6, fontFamily: 'JetBrains Mono, monospace' }}>
                  Last synced: {formatSyncTime(user.lastSyncedAt)}
                </span>
              )}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 10,
                marginBottom: 16,
              }}
            >
              {ROLE_OPTIONS.map(({ value, label, tag, desc }) => {
                const isSelected = selectedRole === value;
                return (
                  <button
                    key={value}
                    id={`settings-role-${value.toLowerCase()}`}
                    onClick={() => setSelectedRole(value)}
                    style={{
                      background: isSelected ? 'rgba(240,192,48,0.05)' : 'var(--s1)',
                      border: isSelected ? '1px solid #f0c030' : '1px solid var(--border)',
                      borderRadius: 8,
                      padding: '10px 12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,192,48,0.30)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      }
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        <CheckCircle size={13} style={{ color: '#f0c030' }} />
                      </div>
                    )}
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 8,
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        fontFamily: 'JetBrains Mono, monospace',
                        color: isSelected ? '#f0c030' : 'var(--t3)',
                        background: isSelected ? 'rgba(240,192,48,0.10)' : 'rgba(61,85,112,0.15)',
                        border: `1px solid ${isSelected ? 'rgba(240,192,48,0.20)' : 'rgba(61,85,112,0.20)'}`,
                        padding: '1px 5px',
                        borderRadius: 3,
                        marginBottom: 6,
                      }}
                    >
                      {tag}
                    </span>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', margin: '0 0 2px' }}>{label}</p>
                    <p style={{ fontSize: 9, color: 'var(--t3)', margin: 0, lineHeight: 1.4 }}>{desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Google Calendar Sync toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0', padding: '10px 12px', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 8 }}>
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
                <p style={{ fontSize: 10, color: 'var(--t3)', margin: '2px 0 0' }}>
                  Nexora will automatically insert detected email deadlines into your Google Calendar.
                </p>
              </div>
            </div>

            <button
              id="save-role-btn"
              onClick={handleSaveRole}
              disabled={isSaving || !hasChanges}
              className="btn-gold"
              style={{
                fontSize: 12,
                padding: '8px 16px',
                opacity: (!hasChanges || isSaving) ? 0.4 : 1,
                cursor: (!hasChanges || isSaving) ? 'not-allowed' : 'pointer',
              }}
            >
              {isSaving ? 'Saving…' : saved ? 'Saved!' : 'Save Role'}
            </button>
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
