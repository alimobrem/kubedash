import { useEffect } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

/**
 * Global keyboard shortcuts (vim-style navigation).
 * Active only when no input/textarea is focused.
 */
export function useKeyboardNav(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const key = e.key;
      const callback = shortcuts[key];
      if (callback) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
