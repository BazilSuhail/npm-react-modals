import type { ReactNode } from 'react';

export interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

export default function ModalHeader({ children, className }: ModalHeaderProps) {
  return <div className={`rm-header ${className ?? ''}`}>{children}</div>;
}
