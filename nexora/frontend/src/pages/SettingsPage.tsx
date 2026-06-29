import React, { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types/User';
import { Shield, User, Zap, CheckCircle, LogOut, Lock, Eye, Clock } from 'lucide-react';

const ROLE_OPTIONS: { value: UserRole; label: string; emoji: string; desc: string }[] = [
  { value: 'STUDENT',         label: 'Student',         emoji: '🎓', desc: 'Assignments, hackathons, placements' },
  { value: 'PROFESSOR',       label: 'Professor',        emoji: '📖', desc: 'Research, meetings, student queries' },
  { value: 'IT_EMPLOYEE',     label: 'IT Employee',      emoji: '💻', desc: 'Technical, infra, incident alerts' },
  { value: 'HR_PROFESSIONAL', label: 'HR Professional',  emoji: '👥', desc: 'Hiring, onboarding, compliance' },
  { value: 'MANAGER',         label: 'Manager',          emoji: '📊', desc: 'Reports, approvals, team updates' },
  { value: 'FREELANCER',      label: 'Freelancer',       emoji: '🚀', desc: 'Client emails, invoices, deadlines' },
];

const SECURITY_POINTS = [
  { icon: Eye,   text: 'Gmail access is read-only — Nexora never sends or modifies emails' },
  { icon: Lock,  text: 'Gmail tokens encrypted at rest with AES-256' },
  { icon: Clock, text: 'JWT sessions expire automatically after 24 hours' },
  { icon: Shield, text: 'No emails stored in plain text — only AI-processed metadata' },
];

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { updateRole, handleLogout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.userRole ?? 'STUDENT');

  const handleSaveRole = async () => {
    setIsSaving(true);
    try {
      await updateRole(selectedRole);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = selectedRole !== user?.userRole;

  return (
    <AppShell title="Settings" subtitle="Manage your Nexora preferences">
      <div className="max-w-2xl mx-auto p-5 space-y-5">

        {/* Profile card */}
        <div className="glass rounded-2xl overflow-hidden animate-fade-in">
          <div
            className="flex items-center gap-2.5 px-5 py-3.5 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <User size={12} className="text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-sm">Profile</h3>
          </div>
          <div className="px-5 py-5 flex items-center gap-4">
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt="avatar"
                className="w-14 h-14 rounded-2xl ring-2 ring-indigo-500/20 shadow-lg"
              />
            ) : (
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-bold text-white text-base">{user?.name}</p>
              <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
              <span
                className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.22)', color: '#a5b4fc' }}
              >
                <Zap size={9} /> {user?.userRole?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Role selection */}
        <div className="glass rounded-2xl overflow-hidden animate-fade-in delay-100">
          <div
            className="flex items-center gap-2.5 px-5 py-3.5 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <Zap size={12} className="text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-sm">Your Role</h3>
            <span className="ml-auto text-xs text-slate-600 font-medium">Affects email prioritization</span>
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Nexora uses your role to prioritize notifications and surface the most relevant emails.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
              {ROLE_OPTIONS.map(({ value, label, emoji, desc }) => {
                const isSelected = selectedRole === value;
                return (
                  <button
                    key={value}
                    id={`settings-role-${value.toLowerCase()}`}
                    onClick={() => setSelectedRole(value)}
                    className="relative p-3 rounded-xl text-left transition-all duration-200 group"
                    style={isSelected ? {
                      background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.35)',
                      boxShadow: '0 2px 12px rgba(99,102,241,0.15)',
                    } : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.2)';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                      }
                    }}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle size={13} className="text-indigo-400" />
                      </div>
                    )}
                    <div className="text-lg mb-1.5">{emoji}</div>
                    <p className={`text-xs font-bold leading-tight mb-0.5 ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>{label}</p>
                    <p className="text-[10px] text-slate-600 leading-snug">{desc}</p>
                  </button>
                );
              })}
            </div>

            <button
              id="save-role-btn"
              onClick={handleSaveRole}
              disabled={isSaving || !hasChanges}
              className="btn-primary flex items-center gap-2 text-sm transition-all"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : saved ? (
                <CheckCircle size={15} />
              ) : null}
              {saved ? 'Saved!' : isSaving ? 'Saving…' : 'Save Role'}
            </button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="glass rounded-2xl overflow-hidden animate-fade-in delay-200">
          <div
            className="flex items-center gap-2.5 px-5 py-3.5 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <Shield size={12} className="text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-sm">Privacy & Security</h3>
          </div>
          <div className="p-5 space-y-3">
            {SECURITY_POINTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}
                >
                  <Icon size={11} className="text-emerald-400" />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
              </div>
            ))}

            <div
              className="pt-4 mt-2 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <button
                id="revoke-access-btn"
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-semibold transition-colors duration-200 group"
              >
                <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
                Revoke Gmail access & logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
