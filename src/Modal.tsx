import { useState, useCallback, useId, type ReactNode } from 'react';
import { ModalContext, type ModalContextValue } from './ModalContext';
import type { SpringPreset, SpringConfig, AnimationVariant } from './spring';

export interface ModalProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  spring?: SpringPreset | SpringConfig;
  animation?: AnimationVariant;
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
  animation,
  backdropColor,
  backdropBlur,
  size,
  animationDuration,
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const dialogId = useId();
  const [labelledById, setLabelledById] = useState<string | undefined>(undefined);
  const [describedById, setDescribedById] = useState<string | undefined>(undefined);

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
    animation,
    backdropColor,
    backdropBlur,
    size,
    animationDuration,
    dialogId,
    labelledById,
    describedById,
    setLabelledById,
    setDescribedById,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
