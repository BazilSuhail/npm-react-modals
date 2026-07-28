import { useEffect, useRef, useCallback } from 'react';

export function useClickOutside(
  enabled: boolean,
  onClick: (e: MouseEvent) => void,
) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!enabled || !panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) {
        onClick(e);
      }
    },
    [enabled, onClick],
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [enabled, handleClick]);

  return panelRef;
}
