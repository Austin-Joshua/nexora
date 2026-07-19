import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { emailApi } from '../../api/emailApi';
import axiosInstance from '../../api/axiosInstance';
import { CategoryTag } from '../common/CategoryTag';
import { PriorityBars } from '../common/PriorityBars';
import { formatDateTime } from '../../utils/formatDate';
import { Paperclip, Clock, CheckSquare, X, Calendar, Brain, ChevronDown, Zap, Check, Copy, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CAT_COLORS } from '../../utils/catColors';
import { useEmailStore } from '../../store/emailStore';

interface EmailDetailProps {
  emailId: number;
  onClose?: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ emailId, onClose }) => {
  const [showFullBody, setShowFullBody] = useState(false);
  const [showDraftReply, setShowDraftReply] = useState(false);
  const [draftStyle, setDraftStyle] = useState<'PROFESSIONAL' | 'FORMAL' | 'FRIENDLY' | 'CONCISE'>('PROFESSIONAL');
  const [draftText, setDraftText] = useState('');
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [completingActions, setCompletingActions] = useState<Set<number>>(new Set());
  const [showThread, setShowThread] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setSelectedEmail } = useEmailStore();

  const { data: email, isLoading } = useQuery({
    queryKey: ['email', emailId],
    queryFn: () => emailApi.getEmail(emailId),
  });

  React.useEffect(() => {
    if (email && !email.isRead) {
      emailApi.markAsRead(email.id)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['emails'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        })
        .catch(() => {});
    }
  }, [email?.id, email?.isRead, queryClient]);

  // C.5 — Thread emails query
  const { data: threadEmails = [], isLoading: isThreadLoading } = useQuery({
    queryKey: ['email-thread', email?.gmailThreadId],
    queryFn: () => emailApi.getEmailThread(email!.gmailThreadId!),
    enabled: !!email?.gmailThreadId && showThread,
  });

  if (isLoading) {
    return (
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: i === 0 ? 32 : i === 1 ? 48 : i === 2 ? 96 : 200 }} />
        ))}
      </div>
    );
  }

  if (!email) return null;

  // Parse action items
  const actionItems = (() => {
    if (email.actions && Array.isArray(email.actions)) {
      return email.actions.map((a: any) => ({
        id: a.id,
        description: a.actionDescription || a.description,
        deadline: a.deadline,
        action_type: a.actionType || a.action_type,
      }));
    }
    try {
      if (email.aiActionItems) {
        const parsed = typeof email.aiActionItems === 'string'
          ? JSON.parse(email.aiActionItems)
          : email.aiActionItems;
        if (Array.isArray(parsed)) {
          return parsed.map((a: any) => ({
            id: a.id,
            description: a.description || a.actionDescription,
            deadline: a.deadline,
            action_type: a.action_type || a.actionType,
          }));
        }
      }
    } catch {}
    return [];
  })();

  const bodyText = email.bodyFull || email.bodySnippet || '';
  const isLong = bodyText.length > 800;
  const displayBody = isLong && !showFullBody ? bodyText.slice(0, 800) + '...' : bodyText;
  const catColor = CAT_COLORS[email.category]?.color ?? '#3d5570';
  const senderInitial = (email.senderName || email.senderEmail)[0]?.toUpperCase() ?? '?';

  const handleDraftReply = async () => {
    setIsDraftLoading(true);
    try {
      const { data } = await axiosInstance.post(`/api/emails/${emailId}/draft-reply`, { style: draftStyle });
      setDraftText(data.draft || '');
    } catch {
      setDraftText('Could not generate draft. Please try again.');
    } finally {
      setIsDraftLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompleteAction = async (actionId: number) => {
    if (!actionId || completingActions.has(actionId)) return;
    setCompletingActions(prev => new Set(prev).add(actionId));
    try {
      await axiosInstance.patch(`/api/email-actions/${actionId}/complete`);
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['email', emailId] });
    } finally {
      setCompletingActions(prev => {
        const s = new Set(prev);
        s.delete(actionId);
        return s;
      });
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }} className="animate-fade-in">
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        {/* Subject row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          <h2 style={{ flex: 1, fontSize: 14, fontWeight: 700, color: 'var(--t1)', margin: 0, lineHeight: 1.4 }}>
            {email.subject || '(no subject)'}
          </h2>
          <CategoryTag category={email.category} />
          <PriorityBars priority={email.priority as 'HIGH' | 'MEDIUM' | 'LOW'} />
          {onClose && (
            <button
              onClick={onClose}
              style={{
                width: 26,
                height: 26,
                borderRadius: 5,
                background: 'transparent',
                border: 'none',
                color: 'var(--t3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--t1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--t3)'; }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sender row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              background: catColor + '22',
              border: `1px solid ${catColor}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 800,
              color: catColor,
              flexShrink: 0,
            }}
          >
            {senderInitial}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', margin: '0 0 2px' }}>
              {email.senderName || 'Unknown'}
            </p>
            <p style={{ fontSize: 11, color: 'var(--t3)', margin: 0 }}>
              {email.senderEmail}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 9,
                color: 'var(--t3)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {formatDateTime(email.receivedAt)} · read-only view
            </span>
            {email.hasAttachments && <Paperclip size={11} style={{ color: 'var(--t3)' }} />}
            {email.deadlineDetected && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 7px',
                  background: 'rgba(240,80,80,0.10)',
                  border: '1px solid rgba(240,80,80,0.22)',
                  borderRadius: 9999,
                  fontSize: 9,
                  color: '#f05050',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                <Calendar size={8} /> {formatDateTime(email.deadlineDetected)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* AI Summary */}
        {email.aiSummary && (
          <div
            style={{
              background: 'var(--s2)',
              borderLeft: '3px solid #f0c030',
              borderRadius: 7,
              padding: '10px 14px',
            }}
            className="animate-fade-in"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Brain size={12} style={{ color: '#f0c030' }} />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#f0c030',
                }}
              >
                AI SUMMARY
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#9bb0c4', margin: 0, lineHeight: 1.6 }}>
              {email.aiSummary}
            </p>
          </div>
        )}

        {/* C.5 — Collapsible Thread View */}
        {email.gmailThreadId && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className="animate-fade-in">
            <button
              onClick={() => setShowThread(t => !t)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--t3)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                alignSelf: 'flex-start',
                padding: '4px 0',
              }}
            >
              <ChevronDown
                size={11}
                style={{
                  transition: 'transform 0.25s ease',
                  transform: showThread ? 'rotate(180deg)' : 'none',
                }}
              />
              THREAD ({showThread && isThreadLoading ? '...' : threadEmails.length || 'view messages'})
            </button>

            {showThread && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  paddingLeft: 8,
                  borderLeft: '1px solid var(--border)',
                }}
                className="animate-fade-in"
              >
                {isThreadLoading ? (
                  <div className="skeleton" style={{ height: 48, borderRadius: 6 }} />
                ) : (
                  threadEmails.map((sibling: any) => {
                    const isCurrent = sibling.id === emailId;
                    const siblingInitial = (sibling.senderName || sibling.senderEmail)[0]?.toUpperCase() ?? '?';
                    return (
                      <div
                        key={sibling.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '6px 10px',
                          background: isCurrent ? 'var(--s1)' : 'transparent',
                          borderLeft: `3px solid ${isCurrent ? '#f0c030' : 'transparent'}`,
                          borderRadius: 4,
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                        onClick={() => {
                          if (!isCurrent) {
                            setSelectedEmail(sibling);
                          }
                        }}
                        onMouseEnter={e => {
                          if (!isCurrent) (e.currentTarget as HTMLElement).style.background = 'var(--s1)';
                        }}
                        onMouseLeave={e => {
                          if (!isCurrent) (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 5,
                            background: 'rgba(79,158,255,0.08)',
                            border: '1px solid rgba(79,158,255,0.18)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 800,
                            color: '#4f9eff',
                            flexShrink: 0,
                          }}
                        >
                          {siblingInitial}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {sibling.senderName || sibling.senderEmail}
                            </span>
                            <span style={{ fontSize: 8, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>
                              {formatDateTime(sibling.receivedAt)}
                            </span>
                          </div>
                          <p style={{ fontSize: 10, color: 'var(--t2)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {sibling.bodySnippet || '(no content snippet)'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Items */}
        {actionItems.length > 0 && (
          <div className="animate-fade-in delay-100">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <CheckSquare size={12} style={{ color: 'var(--t3)' }} />
              <span className="section-label">ACTION ITEMS ({actionItems.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {actionItems.map((a: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    background: 'rgba(79,158,255,0.06)',
                    border: '1px solid rgba(79,158,255,0.18)',
                    borderRadius: 6,
                  }}
                >
                  {/* Completion checkbox */}
                  {a.id && (
                    <button
                      onClick={() => handleCompleteAction(a.id)}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        border: '1px solid var(--border)',
                        background: completingActions.has(a.id) ? 'rgba(64,192,112,0.20)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {completingActions.has(a.id) && <Check size={9} style={{ color: '#40c070' }} />}
                    </button>
                  )}
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12, color: '#4f9eff' }}>{a.description}</span>
                    {a.deadline && (
                      <p style={{ fontSize: 9, color: '#f0c030', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'JetBrains Mono, monospace' }}>
                        <Clock size={8} /> {formatDateTime(a.deadline)}
                      </p>
                    )}
                  </div>
                  {a.action_type && (
                    <span
                      style={{
                        padding: '1px 6px',
                        background: 'rgba(79,158,255,0.10)',
                        border: '1px solid rgba(79,158,255,0.22)',
                        borderRadius: 3,
                        fontSize: 9,
                        fontWeight: 700,
                        color: '#4f9eff',
                        fontFamily: 'JetBrains Mono, monospace',
                        flexShrink: 0,
                      }}
                    >
                      {a.action_type}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Ask Brain + Draft Reply buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button
                className="btn-outline-blue"
                onClick={() => navigate(`/brain?context=email:${emailId}`)}
              >
                <Brain size={12} /> Ask Brain
              </button>
              <button
                className="btn-outline-blue"
                onClick={() => {
                  setShowDraftReply(d => !d);
                  if (!showDraftReply && !draftText) handleDraftReply();
                }}
              >
                <Zap size={12} /> Draft Reply
              </button>
            </div>

            {/* Draft Reply panel */}
            {showDraftReply && (
              <div
                style={{
                  marginTop: 10,
                  background: 'var(--s1)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: 12,
                }}
                className="animate-fade-in"
              >
                {/* Style tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                  {(['PROFESSIONAL', 'FORMAL', 'FRIENDLY', 'CONCISE'] as const).map(s => (
                    <button
                      key={s}
                      className={`tab-item${draftStyle === s ? ' active' : ''}`}
                      onClick={() => setDraftStyle(s)}
                    >
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
                {isDraftLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16, color: 'var(--t3)', fontSize: 12 }}>
                    <RefreshCw size={12} className="animate-spin" /> Generating draft…
                  </div>
                ) : (
                  <textarea
                    value={draftText}
                    onChange={e => setDraftText(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: 100,
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '8px 10px',
                      fontSize: 12,
                      color: 'var(--t1)',
                      resize: 'vertical',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      lineHeight: 1.6,
                    }}
                  />
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="btn-outline-blue" onClick={handleCopy}>
                    <Copy size={11} /> {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    className="btn-outline-blue"
                    onClick={handleDraftReply}
                    disabled={isDraftLoading}
                  >
                    <RefreshCw size={11} className={isDraftLoading ? 'animate-spin' : ''} /> Regenerate
                  </button>
                  <button
                    onClick={() => setShowDraftReply(false)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 11 }}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Email body */}
        <div className="animate-fade-in delay-200">
          <span className="section-label" style={{ display: 'block', marginBottom: 6 }}>EMAIL CONTENT</span>
          <div
            style={{
              background: 'var(--s1)',
              border: '1px solid var(--border)',
              borderRadius: 7,
              padding: '11px 12px',
            }}
          >
            <p style={{ fontSize: 12, color: 'var(--t2)', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {displayBody || '(no content)'}
            </p>
            {isLong && (
              <button
                onClick={() => setShowFullBody(f => !f)}
                style={{
                  marginTop: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  color: '#4f9eff',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <ChevronDown
                  size={12}
                  style={{
                    transition: 'transform 0.25s ease',
                    transform: showFullBody ? 'rotate(180deg)' : 'none',
                  }}
                />
                {showFullBody ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
