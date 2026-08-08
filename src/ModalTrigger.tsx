import { cloneElement, isValidElement, useCallback, type MouseEvent, type MutableRefObject, type ReactNode, type Ref } from 'react';
import { useModalContext } from './ModalContext';

export interface ModalTriggerProps {
  children: ReactNode;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as MutableRefObject<T | null>).current = value;
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

  const child = children as React.ReactElement<Record<string, unknown>>;
  const existingRef = (child as React.ReactElement & { ref?: Ref<HTMLButtonElement> }).ref;
  const existingOnClick = child.props.onClick;

  return cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    ...triggerProps,
    ref: (el: HTMLButtonElement | null) => {
      setTriggerRef(el);
      assignRef(existingRef, el);
    },
    onClick: (e: MouseEvent) => {
      if (typeof existingOnClick === 'function') existingOnClick(e);
      if (!e.defaultPrevented) onOpen();
    },
  });
}
