import { createContext, useContext } from 'react';
import type { SpringPreset, SpringConfig, AnimationVariant } from './spring';

export interface ModalContextValue {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  spring?: SpringPreset | SpringConfig;
  animation?: AnimationVariant;
  backdropColor?: string;
  backdropBlur?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animationDuration?: number;
  dialogId: string;
  labelledById?: string;
  describedById?: string;
  setLabelledById: (id: string | undefined) => void;
  setDescribedById: (id: string | undefined) => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('Modal compound components must be used within <Modal>');
  return ctx;
}
