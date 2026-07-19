import React, { useState, useRef, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface BrainInputProps {
  onSend: (query: string) => void;
  isLoading: boolean;
}

export const BrainInput: React.FC<BrainInputProps> = ({ onSend, isLoading }) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const canSend = !!value.trim() && !isLoading;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 10,
        padding: '8px 12px',
        background: 'var(--s1)',
        border: `1px solid ${focused ? 'rgba(79,158,255,0.45)' : 'var(--border)'}`,
        borderRadius: 8,
        transition: 'border-color 0.15s ease',
      }}
    >
      <textarea
        ref={textareaRef}
        id="brain-query-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Ask Nexora Brain a question about your emails..."
        rows={1}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontSize: 12,
          color: 'var(--t1)',
          minHeight: 20,
          maxHeight: 120,
          lineHeight: 1.5,
          fontFamily: 'inherit',
          padding: 0,
        }}
        disabled={isLoading}
      />
      <button
        id="brain-send-btn"
        onClick={handleSend}
        disabled={!canSend}
        style={{
          width: 26,
          height: 26,
          borderRadius: 6,
          border: 'none',
          background: canSend ? 'var(--gold)' : 'var(--border)',
          color: canSend ? '#080c12' : 'var(--t3)',
          cursor: canSend ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}
      >
        <Send size={12} />
      </button>
    </div>
  );
};
