import { useState, useCallback, type ReactNode } from 'react';
import { ModalContext, type ModalContextValue } from './ModalContext';
import type { SpringPreset, SpringConfig } from './spring';

export interface ModalProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  spring?: SpringPreset | SpringConfig;
  backdropColor?: string;
  backdropBlur?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animationDuration?: number;
}

export default function Modal({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  spring,
  backdropColor,
  backdropBlur,
  size,
  animationDuration,
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const onClose = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
      onOpenChange?.(false);
    }
  }, [isControlled, onOpenChange]);

  const onOpen = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setInternalOpen(true);
      onOpenChange?.(true);
    }
  }, [isControlled, onOpenChange]);

  const value: ModalContextValue = {
    open,
    onClose,
    onOpen,
    spring,
    backdropColor,
    backdropBlur,
    size,
    animationDuration,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
