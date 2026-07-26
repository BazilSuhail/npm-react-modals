import { createContext, useContext } from 'react';
import type { SpringPreset, SpringConfig } from './spring';

export interface ModalContextValue {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  spring?: SpringPreset | SpringConfig;
  backdropColor?: string;
  backdropBlur?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animationDuration?: number;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('Modal compound components must be used within <Modal>');
  return ctx;
}
