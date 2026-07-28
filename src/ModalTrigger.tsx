import { cloneElement, isValidElement, useCallback, type ReactNode } from 'react';
import { useModalContext } from './ModalContext';

export interface ModalTriggerProps {
  children: ReactNode;
}

export default function ModalTrigger({ children }: ModalTriggerProps) {
  const { onOpen, dialogId, triggerRef } = useModalContext();

  const setTriggerRef = useCallback((el: HTMLButtonElement | null) => {
    (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
  }, [triggerRef]);

  const triggerProps = {
    ref: setTriggerRef,
    'aria-controls': dialogId,
    'aria-haspopup': 'dialog' as const,
  };

  if (!isValidElement(children)) {
    return <button onClick={onOpen} {...triggerProps}>{children}</button>;
  }

  return cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    ...triggerProps,
    onClick: (e: React.MouseEvent) => {
      onOpen();
      const existing = (children as React.ReactElement<Record<string, unknown>>).props.onClick;
      if (typeof existing === 'function') existing(e);
    },
  });
}
