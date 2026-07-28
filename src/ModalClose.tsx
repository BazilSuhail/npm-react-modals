import { type ReactNode } from 'react';
import { useModalContext } from './ModalContext';

export interface ModalCloseProps {
  children?: ReactNode;
  className?: string;
}

export default function ModalClose({ children = '×', className }: ModalCloseProps) {
  const { onClose } = useModalContext();

  return (
    <button type="button" className={`rm-close ${className ?? ''}`} onClick={onClose} aria-label="Close">
      {children}
    </button>
  );
}
