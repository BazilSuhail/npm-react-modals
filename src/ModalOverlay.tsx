import { type CSSProperties } from 'react';
import { useModalContext } from './ModalContext';

export interface ModalOverlayProps {
  className?: string;
  style?: CSSProperties;
}

export default function ModalOverlay({ className, style }: ModalOverlayProps) {
  const ctx = useModalContext();

  return (
    <div
      className={`rm-backdrop${className ? ` ${className}` : ''}`}
      data-state={ctx.open ? 'open' : 'closed'}
      style={{
        zIndex: ctx.zIndex ?? 9998,
        background: ctx.backdropColor ?? 'rgba(0, 0, 0, 0.6)',
        backdropFilter: `blur(${ctx.backdropBlur ?? 4}px)`,
        WebkitBackdropFilter: `blur(${ctx.backdropBlur ?? 4}px)`,
        ...style,
      }}
    />
  );
}
