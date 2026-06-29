import React, { useState, useRef, type KeyboardEvent } from 'react';
import { Send, Mic } from 'lucide-react';

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
    // Reset height
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
    el.style.height = Math.min(el.scrollHeight, 144) + 'px';
  };

  const canSend = !!value.trim() && !isLoading;

  return (
    <div
      className="flex items-end gap-3 p-3 rounded-2xl transition-all duration-300"
      style={{
        background: focused ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.03)',
        border: focused ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1), 0 8px 32px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.15)',
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
        placeholder="Ask anything about your emails... (Enter to send, Shift+Enter for new line)"
        rows={1}
        className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none leading-relaxed"
        style={{ minHeight: '24px', maxHeight: '144px', overflowY: 'auto' }}
        disabled={isLoading}
      />

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          className="p-2 text-slate-700 hover:text-slate-400 rounded-lg transition-colors duration-200"
          title="Voice input (coming soon)"
          disabled
        >
          <Mic size={15} />
        </button>

        <button
          id="brain-send-btn"
          onClick={handleSend}
          disabled={!canSend}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: canSend
              ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
              : 'rgba(255,255,255,0.06)',
            boxShadow: canSend ? '0 4px 16px rgba(99,102,241,0.4)' : 'none',
            transform: canSend ? undefined : undefined,
          }}
          title="Send message"
        >
          <Send size={15} className={canSend ? 'text-white' : 'text-slate-500'} />
        </button>
      </div>
    </div>
  );
};
