import { cloneElement, isValidElement, type ReactNode } from 'react';
import { useModalContext } from './ModalContext';

export interface ModalTriggerProps {
  children: ReactNode;
}

export default function ModalTrigger({ children }: ModalTriggerProps) {
  const { onOpen } = useModalContext();

  if (!isValidElement(children)) {
    return <button onClick={onOpen}>{children}</button>;
  }

  return cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    onClick: (e: React.MouseEvent) => {
      onOpen();
      const existing = (children as React.ReactElement<Record<string, unknown>>).props.onClick;
      if (typeof existing === 'function') existing(e);
    },
  });
}
