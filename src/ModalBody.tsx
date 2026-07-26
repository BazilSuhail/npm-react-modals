import type { ReactNode } from 'react';

export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export default function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={`rm-body ${className ?? ''}`}>{children}</div>;
}
