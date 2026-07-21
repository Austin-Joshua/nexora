import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { X, Sparkles, Clock, CheckCircle, Brain, Mail, Send } from 'lucide-react';
import { CategoryTag } from '../common/CategoryTag';
import { PriorityBars } from '../common/PriorityBars';
import { emailApi } from '../../api/emailApi';
import { useNavigate } from 'react-router-dom';
import { formatRelative } from '../../utils/formatDate';

export const DashboardReportModal: React.FC = () => {
  const { reportModal, closeReportModal } = useUIStore();
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [activeReaction, setActiveReaction] = useState(reportModal.email?.reaction || 'NONE');

  if (!reportModal.isOpen || !reportModal.email) return null;

  const email = reportModal.email;

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      await emailApi.sendReply(email.id, replyText);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
      setReplyText('');
    } catch {
    } finally {
      setIsSending(false);
    }
  };

  const handleReaction = async (reaction: any) => {
    setActiveReaction(reaction);
    try {
      await emailApi.updateReaction(email.id, reaction);
    } catch {}
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11, 15, 25, 0.6)',
        backdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={closeReportModal}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          background: 'var(--paper)',
          borderRadius: 'var(--r-lg)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--line)',
        }}
        className="animate-spring-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            background: 'var(--paper-2)',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <CategoryTag category={email.category} />
              <PriorityBars priority={email.priority} />
              {email.deadlineDetected && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--danger)',
                    background: 'rgba(224, 51, 47, 0.1)',
                    padding: '2px 8px',
                    borderRadius: 9999,
                  }}
                >
                  <Clock size={12} /> Deadline: {new Date(email.deadlineDetected).toLocaleDateString()}
                </span>
              )}
            </div>

            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: 'var(--text-1)',
                margin: 0,
                fontFamily: 'Google Sans, Roboto, sans-serif',
                lineHeight: 1.3,
              }}
            >
              {email.subject || '(No Subject)'}
            </h2>

            <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '6px 0 0' }}>
              From <strong style={{ color: 'var(--text-1)' }}>{email.senderName || email.senderEmail}</strong> ({email.senderEmail}) · {formatRelative(email.receivedAt)}
            </p>
          </div>

          <button
            onClick={closeReportModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-2)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: '50%',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* AI Summary Breakdown */}
          {email.aiSummary && (
            <div
              style={{
                background: 'var(--violet-soft)',
                border: '1px solid rgba(108, 76, 255, 0.25)',
                borderRadius: 'var(--r-md)',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--violet)', fontWeight: 700, fontSize: 13 }}>
                <Sparkles size={16} /> AI Executive Summary
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-1)', margin: 0, lineHeight: 1.6 }}>
                {email.aiSummary}
              </p>
            </div>
          )}

          {/* Quick Reaction Triage */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--paper-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase' }}>
              QUICK TRIAGE
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleReaction('DONE')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 9999,
                  border: '1px solid var(--line)',
                  background: activeReaction === 'DONE' ? 'var(--success)' : 'var(--paper)',
                  color: activeReaction === 'DONE' ? '#ffffff' : 'var(--text-1)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ✓ Done
              </button>
              <button
                onClick={() => handleReaction('IMPORTANT')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 9999,
                  border: '1px solid var(--line)',
                  background: activeReaction === 'IMPORTANT' ? 'var(--warn)' : 'var(--paper)',
                  color: activeReaction === 'IMPORTANT' ? '#ffffff' : 'var(--text-1)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ★ Important
              </button>
              <button
                onClick={() => handleReaction('LATER')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 9999,
                  border: '1px solid var(--line)',
                  background: activeReaction === 'LATER' ? 'var(--ember)' : 'var(--paper)',
                  color: activeReaction === 'LATER' ? '#ffffff' : 'var(--text-1)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🕐 Later
              </button>
            </div>
          </div>

          {/* Full Email Snippet / Text */}
          <div>
            <span className="section-label" style={{ marginBottom: 8, display: 'block' }}>EMAIL BODY DETAILS</span>
            <div
              style={{
                background: 'var(--paper-2)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-md)',
                padding: 16,
                fontSize: 13,
                color: 'var(--text-1)',
                lineHeight: 1.6,
                maxHeight: 200,
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {email.bodyFull || email.bodySnippet || email.subject}
            </div>
          </div>

          {/* AI Reply Composer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="section-label">QUICK AI REPLY</span>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply response..."
              rows={3}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 'var(--r-md)',
                background: 'var(--paper-2)',
                border: '1px solid var(--line)',
                fontSize: 13,
                color: 'var(--text-1)',
                outline: 'none',
                resize: 'none',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {sentSuccess ? (
                <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={16} /> Reply sent successfully!
                </span>
              ) : (
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  Will update reaction state &amp; log send event
                </span>
              )}

              <button
                onClick={handleSendReply}
                disabled={!replyText.trim() || isSending}
                className="btn-violet"
                style={{ height: 38, fontSize: 13, opacity: (!replyText.trim() || isSending) ? 0.5 : 1 }}
              >
                <Send size={14} /> {isSending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--line)',
            background: 'var(--paper-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => {
              closeReportModal();
              navigate(`/brain?context=email:${email.id}`);
            }}
            className="btn-outline"
            style={{ fontSize: 13 }}
          >
            <Brain size={16} style={{ color: 'var(--violet)' }} /> Ask Brain about this
          </button>

          <button
            onClick={() => {
              closeReportModal();
              navigate(`/inbox?emailId=${email.id}`);
            }}
            className="btn-ember"
            style={{ height: 40, fontSize: 13 }}
          >
            <Mail size={16} /> View in Full Inbox
          </button>
        </div>
      </div>
    </div>
  );
};
