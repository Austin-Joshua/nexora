import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/User';
import { GraduationCap, BookOpen, Monitor, Users, Briefcase, Globe2, ArrowRight, Zap, CheckCircle } from 'lucide-react';

interface RoleOption {
  role: UserRole;
  icon: React.ReactNode;
  label: string;
  description: string;
  tag: string;
}

const ROLES: RoleOption[] = [
  { role: 'STUDENT',      icon: <GraduationCap size={20} />, tag: 'STU', label: 'Student',         description: 'Assignments, deadlines, placements & hackathons' },
  { role: 'PROFESSOR',    icon: <BookOpen size={20} />,       tag: 'PRF', label: 'Professor',       description: 'Research, student queries & meeting management' },
  { role: 'IT_EMPLOYEE',  icon: <Monitor size={20} />,        tag: 'ITE', label: 'IT Employee',     description: 'Support tickets, system alerts & tech comms' },
  { role: 'HR_PROFESSIONAL', icon: <Users size={20} />,       tag: 'HRP', label: 'HR Professional', description: 'Recruitment, onboarding & policy communications' },
  { role: 'MANAGER',      icon: <Briefcase size={20} />,      tag: 'MGR', label: 'Manager',         description: 'Team updates, approvals & project email tracking' },
  { role: 'FREELANCER',   icon: <Globe2 size={20} />,         tag: 'FRL', label: 'Freelancer',      description: 'Client emails, invoices, deadlines & proposals' },
];

const ACCESS_POINTS = [
  'Reads your Gmail inbox (read-only OAuth scope)',
  'Stores AI summaries & action items — not raw emails',
  'Sends email content to AI for classification',
  'Never sends, modifies, or deletes your emails',
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateRole, user } = useAuth();
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (user?.onboardingComplete) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const firstName = user?.name?.split(' ')[0] ?? 'there';

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
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <div style={{ width: '100%', maxWidth: 700 }} className="animate-fade-in-up">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: '#f0c030',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Zap size={20} style={{ color: '#080c12' }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#e2ecf5', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Welcome,{' '}
            <span style={{ color: '#f0c030' }}>{firstName}</span>
          </h1>
          <p style={{ fontSize: 13, color: '#7890a8', margin: 0, lineHeight: 1.6 }}>
            Choose your role — this shapes how Nexora prioritizes your emails
          </p>
        </div>

        {/* Role grid — 3×2 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            marginBottom: 20,
          }}
        >
          {ROLES.map(({ role, icon, tag, label, description }, index) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                id={`role-${role.toLowerCase()}`}
                onClick={() => setSelectedRole(role)}
                className={`animate-fade-in delay-${(index + 1) * 50}`}
                style={{
                  background: isSelected ? 'rgba(240,192,48,0.05)' : '#0f1720',
                  border: isSelected ? '1px solid #f0c030' : '1px solid #1d2d3f',
                  borderRadius: 9,
                  padding: '14px 16px',
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
                    (e.currentTarget as HTMLElement).style.borderColor = '#1d2d3f';
                  }
                }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: 10, right: 10 }} className="animate-scale-in">
                    <CheckCircle size={14} style={{ color: '#f0c030' }} />
                  </div>
                )}
                {/* Tag + icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: isSelected ? '#f0c030' : '#3d5570',
                      background: isSelected ? 'rgba(240,192,48,0.10)' : 'rgba(61,85,112,0.15)',
                      border: `1px solid ${isSelected ? 'rgba(240,192,48,0.20)' : 'rgba(61,85,112,0.20)'}`,
                      padding: '1px 5px',
                      borderRadius: 3,
                    }}
                  >
                    {tag}
                  </span>
                  <span style={{ color: isSelected ? '#f0c030' : '#7890a8' }}>
                    {icon}
                  </span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: isSelected ? '#e2ecf5' : '#e2ecf5', margin: '0 0 4px' }}>
                  {label}
                </p>
                <p style={{ fontSize: 10, color: '#3d5570', margin: 0, lineHeight: 1.5 }}>
                  {description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Privacy notice */}
        <div
          style={{
            background: 'var(--s2)',
            borderLeft: '3px solid #4f9eff',
            borderRadius: '0 7px 7px 0',
            padding: '12px 16px',
            marginBottom: 20,
          }}
          className="animate-fade-in delay-400"
        >
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', color: '#4f9eff', margin: '0 0 8px' }}>
            WHAT NEXORA ACCESSES
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
            {ACCESS_POINTS.map(point => (
              <div key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ color: '#40c070', fontSize: 10, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 10, color: '#3d5570', lineHeight: 1.5 }}>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          id="onboarding-continue-btn"
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className="btn-gold"
          style={{
            width: '100%',
            justifyContent: 'center',
            fontSize: 14,
            padding: '13px 22px',
            opacity: (!selectedRole || isLoading) ? 0.35 : 1,
            cursor: (!selectedRole || isLoading) ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? (
            <>
              <div style={{ width: 14, height: 14, border: '2px solid rgba(8,12,18,0.3)', borderTopColor: '#080c12', borderRadius: '50%' }} className="animate-spin" />
              Setting up your dashboard…
            </>
          ) : (
            <>
              Continue to Dashboard →
              <ArrowRight size={16} />
            </>
          )}
        </button>

        {selectedRole && !isLoading && (
          <p style={{ textAlign: 'center', fontSize: 10, color: '#3d5570', marginTop: 10 }} className="animate-fade-in">
            Selected: <span style={{ color: '#f0c030', fontWeight: 600 }}>{ROLES.find(r => r.role === selectedRole)?.label}</span> · You can change this in Settings
          </p>
        )}
      </div>
    </div>
  );
};
