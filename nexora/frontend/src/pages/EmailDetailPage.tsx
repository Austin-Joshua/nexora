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
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <span className="text-3xl">📭</span>
          </div>
          <p className="text-slate-300 font-bold">Invalid email ID</p>
          <button
            onClick={() => navigate('/inbox')}
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-semibold"
          >
            <ArrowLeft size={14} /> Back to Inbox
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Email Detail" subtitle="Full email view">
      <div className="h-full flex flex-col">
        {/* Back breadcrumb */}
        <div
          className="flex-shrink-0 px-5 py-3 border-b flex items-center gap-2"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 font-semibold transition-colors duration-200 group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <span className="text-slate-700 text-xs">/</span>
          <span className="text-xs text-slate-500 font-medium">Email #{emailId}</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <EmailDetail emailId={emailId} onClose={handleClose} />
        </div>
      </div>
    </AppShell>
  );
};
