import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, X, Zap } from 'lucide-react';
import { CategoryTag } from '../components/common/CategoryTag';
import { PriorityBars } from '../components/common/PriorityBars';

// Sample inbox preview data
const PREVIEW_EMAILS = [
  { sender: 'Dr. Sarah Chen', subject: 'Assignment 4 deadline extended to Friday 11:59 PM', category: 'ASSIGNMENT', priority: 'HIGH' as const, borderColor: '#f05050' },
  { sender: 'Devfolio', subject: 'Smart India Hackathon registrations close in 48h', category: 'HACKATHON', priority: 'HIGH' as const, borderColor: '#f05050' },
  { sender: 'TCS Nextstep', subject: 'Interview shortlist - Round 2 confirmed for you', category: 'PLACEMENT', priority: 'HIGH' as const, borderColor: '#f05050' },
  { sender: 'HOD Office', subject: 'Mandatory attendance policy change effective Monday', category: 'ANNOUNCEMENT', priority: 'MEDIUM' as const, borderColor: '#f0c030' },
];

const TRUST_POINTS = [
  'Read-only Gmail access',
  'AES-256 token encryption',
  'Role-aware AI · Student-first',
];

export const LandingPage: React.FC = () => {
  const { handleGoogleLogin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const authError = searchParams.get('auth_error');
  const [showErrorBanner, setShowErrorBanner] = useState(!!authError);

  const dismissError = () => {
    setShowErrorBanner(false);
    searchParams.delete('auth_error');
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080c12',
        backgroundImage: 'radial-gradient(circle, #1a2535 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          height: 56,
          borderBottom: '1px solid #1d2d3f',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              background: '#f0c030',
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={14} style={{ color: '#080c12' }} />
          </div>
          <span style={{ fontWeight: 800, color: '#e2ecf5', fontSize: 16, letterSpacing: '-0.01em' }}>
            Nexora
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            id="landing-signin-btn"
            onClick={handleGoogleLogin}
            style={{
              padding: '7px 16px',
              background: 'transparent',
              border: '1px solid #1d2d3f',
              borderRadius: 7,
              color: '#7890a8',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#253447';
              (e.currentTarget as HTMLElement).style.color = '#e2ecf5';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#1d2d3f';
              (e.currentTarget as HTMLElement).style.color = '#7890a8';
            }}
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Error banner */}
      {showErrorBanner && (
        <div
          style={{
            margin: '16px 28px 0',
            background: 'rgba(240,80,80,0.08)',
            border: '1px solid rgba(240,80,80,0.30)',
            borderRadius: 9,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
          className="animate-fade-in"
        >
          <AlertTriangle size={16} style={{ color: '#f05050', flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <p style={{ color: '#f05050', fontWeight: 600, fontSize: 13, margin: '0 0 4px' }}>
              {authError === 'access_denied' ? 'Sign-In Cancelled' : 'Sign-In Failed'}
            </p>
            <p style={{ color: 'rgba(240,80,80,0.7)', fontSize: 11, margin: 0 }}>
              {authError === 'access_denied'
                ? 'You cancelled the Google sign-in. Click "Connect Gmail" to try again.'
                : `Sign-in was blocked by Google (${authError}). Please try again.`}
            </p>
          </div>
          <button
            onClick={dismissError}
            style={{ color: '#f05050', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Hero — 2-column grid */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
          maxWidth: 1100,
          margin: '0 auto',
          padding: '60px 40px',
          width: '100%',
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
          {/* Eyebrow */}
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              fontFamily: 'JetBrains Mono, monospace',
              color: '#f0c030',
            }}
          >
            AI · EMAIL · INTELLIGENCE
          </span>

          {/* H1 */}
          <h1
            style={{
              fontSize: 'clamp(30px, 4vw, 42px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#e2ecf5',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Stop reading
            <br />
            the noise.
            <br />
            <span style={{ color: '#f0c030' }}>Act on what matters.</span>
          </h1>

          {/* Body */}
          <p
            style={{
              fontSize: 13,
              color: '#7890a8',
              lineHeight: 1.7,
              maxWidth: 300,
              margin: 0,
            }}
          >
            Nexora reads every email in your Gmail inbox, classifies it with AI,
            and surfaces only what needs your attention — deadlines, placements,
            hackathons, attendance.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button
              id="hero-cta-btn"
              onClick={handleGoogleLogin}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 22px',
                background: '#f0c030',
                color: '#080c12',
                fontWeight: 800,
                fontSize: 14,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                width: 'fit-content',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f5d050'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f0c030'; }}
            >
              {/* Google icon */}
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#080c12" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#080c12" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#080c12" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#080c12" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Connect Gmail
            </button>

            {/* Trust signals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TRUST_POINTS.map((point) => (
                <div key={point} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <CheckCircle size={11} style={{ color: '#40c070', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#3d5570' }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Inbox preview card */}
        <div className="animate-slide-right" style={{ position: 'relative' }}>
          <div
            style={{
              background: '#0f1720',
              border: '1px solid #1d2d3f',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            {/* Card header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                borderBottom: '1px solid #1d2d3f',
              }}
            >
              {/* Pulsing gold dot */}
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#f0c030',
                  flexShrink: 0,
                  animation: 'pulse-soft 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  color: '#7890a8',
                  fontWeight: 500,
                }}
              >
                nexora.ai
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#3d5570' }}>
                73 emails ·{' '}
                <span style={{ color: '#f0c030', fontWeight: 700 }}>4</span>
                {' '}need action
              </span>
            </div>

            {/* Email rows */}
            {PREVIEW_EMAILS.map((email, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 14px',
                  borderLeft: `3px solid ${email.borderColor}`,
                  borderBottom: i < PREVIEW_EMAILS.length - 1 ? '1px solid #1d2d3f' : 'none',
                }}
              >
                <span
                  style={{
                    minWidth: 80,
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#e2ecf5',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {email.sender}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 11,
                    color: '#7890a8',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {email.subject}
                </span>
                <CategoryTag category={email.category} />
                <PriorityBars priority={email.priority} />
              </div>
            ))}

            {/* Footer */}
            <div
              style={{
                padding: '8px 14px',
                borderTop: '1px solid #1d2d3f',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                color: '#3d5570',
              }}
            >
              -- filter -- 69 promotional &amp; low-priority emails hidden
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #1d2d3f',
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 22,
              height: 22,
              background: '#f0c030',
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={11} style={{ color: '#080c12' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2ecf5' }}>Nexora</span>
        </div>
        <p style={{ fontSize: 11, color: '#3d5570' }}>
          © 2025 Nexora · AI Email Intelligence · React + Spring Boot
        </p>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#3d5570' }}>
          <Link to="/privacy" style={{ color: '#3d5570', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#7890a8')} onMouseLeave={e => (e.currentTarget.style.color = '#3d5570')}>Privacy Policy</Link>
          <span>·</span>
          <a href="mailto:austinjoshuamj@gmail.com" style={{ color: '#3d5570', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#7890a8')} onMouseLeave={e => (e.currentTarget.style.color = '#3d5570')}>Contact</a>
        </div>
      </footer>
    </div>
  );
};
