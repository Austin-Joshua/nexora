import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/User';
import { GraduationCap, BookOpen, Monitor, Users, Briefcase, Globe2, ArrowRight, Zap, CheckCircle, Lock } from 'lucide-react';

interface RoleOption {
  role: UserRole;
  icon: React.ReactNode;
  label: string;
  description: string;
  gradient: string;
  glow: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'STUDENT',
    icon: <GraduationCap size={26} />,
    label: 'Student',
    description: 'Assignments, deadlines, placements & hackathons',
    gradient: 'linear-gradient(135deg, #6366f1, #7c3aed)',
    glow: 'rgba(99,102,241,0.35)',
  },
  {
    role: 'PROFESSOR',
    icon: <BookOpen size={26} />,
    label: 'Professor',
    description: 'Research, student queries & meeting management',
    gradient: 'linear-gradient(135deg, #059669, #0d9488)',
    glow: 'rgba(5,150,105,0.35)',
  },
  {
    role: 'IT_EMPLOYEE',
    icon: <Monitor size={26} />,
    label: 'IT Employee',
    description: 'Support tickets, system alerts & tech comms',
    gradient: 'linear-gradient(135deg, #2563eb, #0891b2)',
    glow: 'rgba(37,99,235,0.35)',
  },
  {
    role: 'HR_PROFESSIONAL',
    icon: <Users size={26} />,
    label: 'HR Professional',
    description: 'Recruitment, onboarding & policy communications',
    gradient: 'linear-gradient(135deg, #db2777, #e11d48)',
    glow: 'rgba(219,39,119,0.35)',
  },
  {
    role: 'MANAGER',
    icon: <Briefcase size={26} />,
    label: 'Manager',
    description: 'Team updates, approvals & project email tracking',
    gradient: 'linear-gradient(135deg, #d97706, #ea580c)',
    glow: 'rgba(217,119,6,0.35)',
  },
  {
    role: 'FREELANCER',
    icon: <Globe2 size={26} />,
    label: 'Freelancer',
    description: 'Client emails, invoices, deadlines & proposals',
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    glow: 'rgba(124,58,237,0.35)',
  },
];

const ACCESS_POINTS = [
  { text: 'Reads your Gmail inbox (read-only OAuth scope)', ok: true },
  { text: 'Stores AI summaries & action items — not raw emails', ok: true },
  { text: 'Sends email content to Claude AI for classification', ok: true },
  { text: 'Never sends, modifies, or deletes your emails', ok: true },
];

export const OnboardingPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { updateRole, user } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedRole) return;
    setIsLoading(true);
    try {
      await updateRole(selectedRole);
      navigate('/dashboard');
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background orb */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative w-full max-w-3xl animate-fade-in-up">
        {/* Logo + heading */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 animate-glow"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}
          >
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
            Welcome, {user?.name?.split(' ')[0] ?? 'there'}! 👋
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
            Tell Nexora your role so it can prioritize
            <span className="text-slate-300 font-medium"> exactly what matters to you.</span>
          </p>
        </div>

        {/* Role grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {ROLES.map(({ role, icon, label, description, gradient, glow }, index) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                id={`role-${role.toLowerCase()}`}
                onClick={() => setSelectedRole(role)}
                className={`relative p-5 rounded-2xl text-left transition-all duration-250 group animate-fade-in delay-${(index + 1) * 50}`}
                style={isSelected ? {
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  transform: 'scale(1.02)',
                  boxShadow: `0 8px 32px ${glow}`,
                } : {
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                  }
                }}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 animate-scale-in">
                    <CheckCircle size={16} className="text-indigo-400" />
                  </div>
                )}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white transition-transform duration-300 group-hover:scale-110"
                  style={{ background: gradient, boxShadow: `0 4px 16px ${glow}` }}
                >
                  {icon}
                </div>
                <p className={`font-bold text-sm mb-1.5 transition-colors ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                  {label}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
              </button>
            );
          })}
        </div>

        {/* Privacy notice */}
        <div
          className="rounded-2xl p-4 mb-6 animate-fade-in delay-400"
          style={{
            background: 'rgba(16,185,129,0.05)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lock size={13} className="text-emerald-400" />
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">What Nexora accesses</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ACCESS_POINTS.map(({ text, ok }) => (
              <div key={text} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                <span className="text-emerald-500 flex-shrink-0 mt-0.5">{ok ? '✓' : '✗'}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          id="onboarding-continue-btn"
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className="w-full btn-primary flex items-center justify-center gap-2.5 py-4 text-base font-bold disabled:opacity-35 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Setting up your dashboard…
            </>
          ) : (
            <>
              Continue to Dashboard
              <ArrowRight size={18} className={`transition-transform duration-200 ${selectedRole ? 'translate-x-0' : ''}`} />
            </>
          )}
        </button>

        {selectedRole && !isLoading && (
          <p className="text-center text-xs text-slate-600 mt-3 animate-fade-in">
            Selected: <span className="text-indigo-400 font-semibold">{ROLES.find(r => r.role === selectedRole)?.label}</span> · You can change this in Settings anytime
          </p>
        )}
      </div>
    </div>
  );
};
