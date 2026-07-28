import { useId, useEffect, type ReactNode } from 'react';
import { useModalContext } from './ModalContext';

export interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

export default function ModalHeader({ children, className }: ModalHeaderProps) {
  const id = useId();
  const { setLabelledById } = useModalContext();

  useEffect(() => {
    setLabelledById(id);
    return () => setLabelledById(undefined);
  }, [id, setLabelledById]);

  return (
    <div id={id} className={`rm-header ${className ?? ''}`}>
      {children}
    </div>
  );
}
