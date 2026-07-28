import { useEffect } from 'react';

export function useEscapeKey(
  enabled: boolean,
  onEscape: (e: KeyboardEvent) => void,
) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onEscape(e);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onEscape]);
}
