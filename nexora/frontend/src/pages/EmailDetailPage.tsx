import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { EmailDetail } from '../components/email/EmailDetail';
import { ArrowLeft } from 'lucide-react';

export const EmailDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const emailId = id ? parseInt(id, 10) : null;

  if (!emailId || isNaN(emailId)) {
    return (
      <AppShell title="Email Detail">
        <div style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)', fontSize: 14 }}>Invalid email ID.</p>
          <button className="btn-outline" onClick={() => navigate('/inbox')}>
            <ArrowLeft size={14} /> Back to Inbox
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell noScroll>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)' }}>
          <button
            className="btn-outline"
            onClick={() => navigate('/inbox')}
            style={{ fontSize: 12 }}
          >
            <ArrowLeft size={14} /> Back to Inbox
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          <EmailDetail emailId={emailId} onClose={() => navigate('/inbox')} />
        </div>
      </div>
    </AppShell>
  );
};
