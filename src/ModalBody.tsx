import { useId, useEffect, type ReactNode } from 'react';
import { useModalContext } from './ModalContext';

export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export default function ModalBody({ children, className }: ModalBodyProps) {
  const id = useId();
  const { setDescribedById } = useModalContext();

  useEffect(() => {
    setDescribedById(id);
    return () => setDescribedById(undefined);
  }, [id, setDescribedById]);

  return (
    <div id={id} className={`rm-body ${className ?? ''}`}>
      {children}
    </div>
  );
}
