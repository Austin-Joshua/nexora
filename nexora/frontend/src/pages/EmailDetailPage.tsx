import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { EmailDetail } from '../components/email/EmailDetail';
import { ArrowLeft } from 'lucide-react';

export const EmailDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const emailId = id ? parseInt(id, 10) : null;

  const handleClose = () => navigate(-1);

  if (!emailId || isNaN(emailId)) {
    return (
      <AppShell title="Email" subtitle="Email not found">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 32, textAlign: 'center' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: 'var(--s1)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            📭
          </div>
          <p style={{ color: 'var(--t1)', fontWeight: 700 }}>Invalid email ID</p>
          <button
            onClick={() => navigate('/inbox')}
            className="btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}
          >
            <ArrowLeft size={12} /> Back to Inbox
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Email Detail" subtitle="Full email view">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Back breadcrumb */}
        <div
          style={{
            flexShrink: 0,
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <button
            onClick={handleClose}
            className="btn-ghost"
            style={{
              fontSize: 10,
              padding: '4px 8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <ArrowLeft size={10} /> Back
          </button>
          <span style={{ color: 'var(--border)', fontSize: 11 }}>/</span>
          <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>EMAIL #{emailId}</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <EmailDetail emailId={emailId} onClose={handleClose} />
        </div>
      </div>
    </AppShell>
  );
};
