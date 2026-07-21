import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onNext?: () => void;
  onPrev?: () => void;
  onArchive?: () => void;
  onReply?: () => void;
  onFocusSearch?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onNext,
  onPrev,
  onArchive,
  onReply,
  onFocusSearch,
  enabled = true,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts inside text inputs or textareas
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'j':
          e.preventDefault();
          onNext?.();
          break;
        case 'k':
          e.preventDefault();
          onPrev?.();
          break;
        case 'e':
          e.preventDefault();
          onArchive?.();
          break;
        case 'r':
          e.preventDefault();
          onReply?.();
          break;
        case '/':
          e.preventDefault();
          onFocusSearch?.();
          const searchInput = document.getElementById('topbar-search');
          if (searchInput) {
            searchInput.focus();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onNext, onPrev, onArchive, onReply, onFocusSearch]);
}
