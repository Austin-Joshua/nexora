import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowLeft, Shield, Lock, Eye, Trash2, Mail } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const lastUpdated = 'July 20, 2025';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080c12',
        backgroundImage: 'radial-gradient(circle, #1a2535 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        color: '#e2ecf5',
        fontFamily: 'Inter, system-ui, sans-serif',
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
          position: 'sticky',
          top: 0,
          background: '#080c12',
          zIndex: 10,
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
          <span style={{ fontWeight: 800, color: '#e2ecf5', fontSize: 16 }}>Nexora</span>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: '1px solid #1d2d3f',
            borderRadius: 7,
            color: '#7890a8',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            padding: '6px 14px',
          }}
        >
          <ArrowLeft size={14} />
          Back to Home
        </button>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 28px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(240,192,48,0.08)',
              border: '1px solid rgba(240,192,48,0.2)',
              borderRadius: 6,
              padding: '5px 12px',
              marginBottom: 20,
            }}
          >
            <Shield size={12} style={{ color: '#f0c030' }} />
            <span style={{ fontSize: 11, color: '#f0c030', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Privacy Policy
            </span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 12px', color: '#e2ecf5' }}>
            Your Privacy Matters
          </h1>
          <p style={{ color: '#7890a8', fontSize: 14, margin: 0 }}>
            Last updated: {lastUpdated} &nbsp;·&nbsp; Effective immediately
          </p>
        </div>

        {/* Intro */}
        <div
          style={{
            background: 'rgba(240,192,48,0.05)',
            border: '1px solid rgba(240,192,48,0.15)',
            borderRadius: 10,
            padding: 24,
            marginBottom: 40,
          }}
        >
          <p style={{ color: '#c8dae8', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            Nexora ("<strong style={{ color: '#e2ecf5' }}>we</strong>", "
            <strong style={{ color: '#e2ecf5' }}>us</strong>", or "
            <strong style={{ color: '#e2ecf5' }}>our</strong>") is an AI-powered email intelligence platform
            built for college students. This Privacy Policy explains how we collect, use, and protect your
            information when you use our service. By connecting your Gmail account, you agree to this policy.
          </p>
        </div>

        {/* Sections */}
        {[
          {
            icon: <Eye size={18} style={{ color: '#f0c030' }} />,
            title: '1. Information We Collect',
            content: (
              <>
                <p>When you sign in with Google and connect your Gmail, we collect:</p>
                <ul>
                  <li><strong>Google Account info</strong>: your name, email address, and profile picture (via OpenID Connect)</li>
                  <li><strong>Gmail messages</strong>: subject lines, sender/recipient info, body text, and metadata — used solely to classify, summarise, and display your emails inside Nexora</li>
                  <li><strong>OAuth tokens</strong>: your Google access token and refresh token, stored encrypted (AES-256) in our database so we can sync your inbox on your behalf</li>
                  <li><strong>Usage data</strong>: AI queries you submit to Nexora Brain, and actions you take inside the app (e.g. marking emails as read)</li>
                </ul>
                <p>We do <strong>not</strong> collect passwords, payment info, or any data outside the scopes you explicitly authorise.</p>
              </>
            ),
          },
          {
            icon: <Lock size={18} style={{ color: '#f0c030' }} />,
            title: '2. How We Use Your Data',
            content: (
              <>
                <p>We use your data exclusively to provide the Nexora service:</p>
                <ul>
                  <li>Sync your Gmail inbox and display emails in our interface</li>
                  <li>Run AI classification to tag emails as Assignments, Placements, Hackathons, etc.</li>
                  <li>Generate AI summaries and extract action items using the Gemini API</li>
                  <li>Answer natural language questions about your inbox via Nexora Brain</li>
                  <li>Send real-time notifications for deadlines and urgent emails</li>
                </ul>
                <p>
                  <strong>We never sell, rent, or share your email content or personal data with third parties</strong> for
                  advertising or any commercial purpose.
                </p>
              </>
            ),
          },
          {
            icon: <Shield size={18} style={{ color: '#f0c030' }} />,
            title: '3. Google API Data — Limited Use Disclosure',
            content: (
              <>
                <p>
                  Nexora's use of information received from Google APIs adheres to the{' '}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#4f9eff' }}
                  >
                    Google API Services User Data Policy
                  </a>
                  , including the Limited Use requirements.
                </p>
                <p>Specifically:</p>
                <ul>
                  <li>Gmail data is only used to provide features directly visible to you within Nexora</li>
                  <li>We do not use Gmail data for advertising or to train AI/ML models on user data</li>
                  <li>We do not allow humans to read your Gmail data, except for security or legal compliance</li>
                  <li>We do not transfer Gmail data to third parties, except as necessary to provide the service (e.g., sending message content to Google's Gemini API for summarisation)</li>
                </ul>
              </>
            ),
          },
          {
            icon: <Lock size={18} style={{ color: '#f0c030' }} />,
            title: '4. Data Security',
            content: (
              <ul>
                <li>OAuth tokens are encrypted at rest using AES-256 before storage</li>
                <li>All data is transmitted over HTTPS / TLS</li>
                <li>JWT-based authentication with short expiry ensures session security</li>
                <li>We do not log the full content of your emails in application logs</li>
                <li>Access tokens are automatically refreshed and old tokens discarded</li>
              </ul>
            ),
          },
          {
            icon: <Mail size={18} style={{ color: '#f0c030' }} />,
            title: '5. Third-Party Services',
            content: (
              <>
                <p>We use the following third-party services to operate Nexora:</p>
                <ul>
                  <li><strong>Google Gmail API</strong> — to read your inbox and mark emails as read</li>
                  <li><strong>Google Calendar API</strong> — to read and create calendar events for detected deadlines</li>
                  <li><strong>Google Gemini API</strong> — to classify emails and answer AI queries (email snippets are sent to Gemini for analysis)</li>
                </ul>
                <p>Each third party operates under their own privacy policies and terms of service.</p>
              </>
            ),
          },
          {
            icon: <Trash2 size={18} style={{ color: '#f0c030' }} />,
            title: '6. Your Rights & Data Deletion',
            content: (
              <>
                <p>You have full control over your data:</p>
                <ul>
                  <li><strong>Revoke access</strong>: Go to Settings → Revoke Gmail Access. This clears your stored tokens immediately. You can also revoke access from your{' '}
                    <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: '#4f9eff' }}>Google Account permissions page</a>.
                  </li>
                  <li><strong>Delete your data</strong>: Contact us at the email below and we will delete all your stored emails, tokens, and account data within 30 days</li>
                  <li><strong>Export your data</strong>: Contact us to request a copy of all data we hold about you</li>
                </ul>
              </>
            ),
          },
          {
            icon: <Shield size={18} style={{ color: '#f0c030' }} />,
            title: '7. Children\'s Privacy',
            content: (
              <p>
                Nexora is intended for college students and is not directed at children under the age of 13.
                We do not knowingly collect personal information from children under 13. If you believe a
                child has provided us with personal information, please contact us immediately.
              </p>
            ),
          },
          {
            icon: <Mail size={18} style={{ color: '#f0c030' }} />,
            title: '8. Changes to This Policy',
            content: (
              <p>
                We may update this Privacy Policy from time to time. When we do, we will update the "Last
                updated" date at the top of this page. Continued use of Nexora after any changes constitutes
                your acceptance of the new policy. For significant changes, we will notify users via the app.
              </p>
            ),
          },
          {
            icon: <Mail size={18} style={{ color: '#f0c030' }} />,
            title: '9. Contact Us',
            content: (
              <>
                <p>If you have questions about this Privacy Policy or want to request data deletion, contact us:</p>
                <ul>
                  <li><strong>Email</strong>: <a href="mailto:austinjoshuamj@gmail.com" style={{ color: '#4f9eff' }}>austinjoshuamj@gmail.com</a></li>
                  <li><strong>App</strong>: Settings → Contact / Feedback inside Nexora</li>
                </ul>
              </>
            ),
          },
        ].map((section, i) => (
          <div
            key={i}
            style={{
              background: '#0f1720',
              border: '1px solid #1d2d3f',
              borderRadius: 10,
              padding: 28,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              {section.icon}
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2ecf5', margin: 0 }}>{section.title}</h2>
            </div>
            <div
              style={{
                color: '#7890a8',
                fontSize: 14,
                lineHeight: 1.8,
              }}
            >
              {section.content}
            </div>
          </div>
        ))}

        {/* Footer note */}
        <div
          style={{
            marginTop: 40,
            padding: 20,
            borderTop: '1px solid #1d2d3f',
            textAlign: 'center',
            color: '#3d5570',
            fontSize: 12,
          }}
        >
          © 2025 Nexora · AI Email Intelligence · Built for students, by students
        </div>
      </div>

      <style>{`
        ul { padding-left: 20px; margin: 12px 0; }
        li { margin-bottom: 8px; }
        p { margin: 0 0 12px; }
        strong { color: #c8dae8; }
        a:hover { opacity: 0.8; }
      `}</style>
    </div>
  );
};
