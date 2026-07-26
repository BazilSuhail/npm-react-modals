import type { ReactNode } from 'react';

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export default function ModalFooter({ children, className }: ModalFooterProps) {
  return <div className={`rm-footer ${className ?? ''}`}>{children}</div>;
}
