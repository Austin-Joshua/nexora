import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import { Zap, Brain, Bell, Shield, Mail, ArrowRight, CheckCircle, AlertTriangle, X } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'Nexora Brain',
    desc: 'Ask anything about your past emails in plain English. Get instant, accurate answers.',
    color: 'from-indigo-500 to-violet-600',
    glow: 'rgba(99,102,241,0.4)',
    delay: 'delay-100',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    desc: 'Role-aware notifications for deadlines, placements & hackathons — nothing else.',
    color: 'from-orange-500 to-red-500',
    glow: 'rgba(249,115,22,0.4)',
    delay: 'delay-200',
  },
  {
    icon: Mail,
    title: 'AI Classification',
    desc: 'Every email auto-categorized, prioritized, and actionable — instantly.',
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.4)',
    delay: 'delay-300',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    desc: 'Read-only Gmail access. Tokens encrypted with AES-256. Zero emails stored as plain text.',
    color: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59,130,246,0.4)',
    delay: 'delay-400',
  },
];

const TRUST_POINTS = [
  'No emails stored in plain text',
  'Read-only Gmail access',
  'AES-256 token encryption',
];

export const LandingPage: React.FC = () => {
  const { handleGoogleLogin } = useAuth();
  const orbRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const authError = searchParams.get('auth_error');
  const [showErrorBanner, setShowErrorBanner] = useState(!!authError);

  const dismissError = () => {
    setShowErrorBanner(false);
    searchParams.delete('auth_error');
    setSearchParams(searchParams, { replace: true });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <div
          ref={orbRef}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #6366f1 0%, #7c3aed 50%, transparent 70%)',
            filter: 'blur(60px)',
            transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, #4f46e5 50%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{
            background: 'conic-gradient(from 0deg, #6366f1, #7c3aed, #ec4899, #6366f1)',
            filter: 'blur(80px)',
            animation: 'spin-slow 20s linear infinite',
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-nexora-gradient flex items-center justify-center animate-glow shadow-lg shadow-indigo-900/40">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Nexora</span>
        </div>
        <div className="flex items-center gap-3">
          {import.meta.env.DEV && (
            <a
              id="nav-bypass-btn"
              href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/bypass`}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline underline-offset-2 mr-3"
            >
              Bypass Login
            </a>
          )}
          <button
            id="landing-signin-btn"
            onClick={handleGoogleLogin}
            className="btn-ghost text-sm"
          >
            Sign in
          </button>
          <button
            id="landing-cta-nav-btn"
            onClick={handleGoogleLogin}
            className="btn-primary text-sm py-2 px-4"
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* Auth Error Banner */}
      {showErrorBanner && (
        <div
          className="relative z-10 mx-6 mt-4 rounded-2xl px-5 py-4 flex items-start gap-4 animate-fade-in"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-red-300 mb-1">
              {authError === 'access_denied'
                ? 'Google Sign-In Cancelled'
                : authError === 'redirect_uri_mismatch'
                ? 'OAuth Configuration Error'
                : 'Google Sign-In Failed'}
            </p>
            <p className="text-xs text-red-400/80 leading-relaxed mb-2">
              {authError === 'access_denied'
                ? 'You cancelled the Google sign-in. Click "Continue with Google" to try again.'
                : authError === 'redirect_uri_mismatch'
                ? 'The redirect URI is not authorized in Google Cloud Console. Contact the app administrator.'
                : `Sign-in was blocked by Google (${authError}). Please try again or use a different account.`}
            </p>
            <button
              onClick={handleGoogleLogin}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline underline-offset-2"
            >
              Try Again →
            </button>
          </div>
          <button
            onClick={dismissError}
            className="p-1.5 text-red-500/60 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}


      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-soft" />
          AI-powered email intelligence · Built for students
        </div>

        <h1 className="animate-fade-in delay-100 text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-6 tracking-tight text-balance">
          Your inbox,<br />
          <span className="gradient-text text-glow">finally intelligent.</span>
        </h1>

        <p className="animate-fade-in delay-200 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Nexora reads your Gmail, classifies every email with AI, surfaces deadlines
          and action items, and answers questions about your inbox in plain English.
          <span className="text-slate-300 font-medium"> Never miss a deadline again.</span>
        </p>

        <div className="animate-fade-in delay-300 flex flex-col sm:flex-row items-center gap-4 justify-center mb-4">
          <button
            id="hero-cta-btn"
            onClick={handleGoogleLogin}
            className="btn-primary flex items-center gap-3 text-base px-8 py-4 animate-glow"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <a href="#features" className="btn-ghost flex items-center gap-2 text-base px-6 py-4">
            See how it works <ArrowRight size={16} />
          </a>
        </div>

        {/* Developer Bypass Option — DEV only */}
        {import.meta.env.DEV && (
          <div className="animate-fade-in delay-300 mb-8">
            <a
              id="developer-bypass-btn"
              href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/bypass`}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline underline-offset-2"
            >
              🔧 Developer Bypass (Local Mock Login)
            </a>
          </div>
        )}

        {/* Trust signals */}
        <div className="animate-fade-in delay-400 flex flex-wrap items-center justify-center gap-4">
          {TRUST_POINTS.map((point) => (
            <div key={point} className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
              {point}
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div
          id="features"
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl"
        >
          {FEATURES.map(({ icon: Icon, title, desc, color, glow, delay }) => (
            <div
              key={title}
              className={`animate-fade-in-up ${delay} glass rounded-2xl p-5 text-left group cursor-default`}
              style={{ '--glow-color': glow } as React.CSSProperties}
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}
                style={{ boxShadow: `0 4px 20px ${glow}` }}
              >
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-white mb-2 text-sm leading-snug">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Comparison section */}
        <div className="mt-20 max-w-3xl w-full animate-fade-in-up delay-500">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-3">Why Nexora?</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
            Not another generic AI tool.
          </h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Unlike Gmail Smart Compose or Microsoft Copilot, Nexora knows your role and prioritizes accordingly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Gmail Smart Compose', feature: 'Response suggestions only', emoji: '✦', bad: true },
              { label: 'Microsoft Copilot', feature: 'Generic AI, no student context', emoji: '✦', bad: true },
              { label: 'Nexora', feature: 'Role-aware · Deadlines · Brain Q&A', emoji: '⚡', bad: false },
            ].map(({ label, feature, emoji, bad }) => (
              <div
                key={label}
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  bad
                    ? 'bg-white/2 border-white/6 opacity-60'
                    : 'bg-indigo-600/8 border-indigo-500/30 shadow-lg shadow-indigo-900/20'
                }`}
              >
                <p className={`text-2xl mb-3 ${bad ? '' : ''}`}>{emoji}</p>
                <p className={`font-bold text-sm mb-1.5 ${bad ? 'text-slate-400' : 'text-indigo-300'}`}>{label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{feature}</p>
                {!bad && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <CheckCircle size={12} /> Best choice for students
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-8 px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-nexora-gradient flex items-center justify-center">
              <Zap size={11} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Nexora</span>
          </div>
          <p className="text-xs text-slate-600 text-center">
            © 2025 Nexora · Communication Intelligence Platform · React + Spring Boot + Gemini AI
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
