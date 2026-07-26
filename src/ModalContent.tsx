import { useState, useRef, useCallback, useEffect, type MutableRefObject, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useModalContext } from './ModalContext';
import { animateIn, animateOut } from './animate';
import { useEscapeKey } from './hooks/useEscapeKey';
import { useClickOutside } from './hooks/useClickOutside';
import type { SpringPreset, SpringConfig, AnimationVariant } from './spring';

export interface ModalContentProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: AnimationVariant;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  backdropColor?: string;
  backdropBlur?: number;
  spring?: SpringPreset | SpringConfig;
  animationDuration?: number;
}

const SAFETY_UNMOUNT_MS = 600;

export default function ModalContent({
  children,
  className,
  size: sizeProp,
  animation: animationProp,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  backdropColor,
  backdropBlur,
  spring,
  animationDuration,
}: ModalContentProps) {
  const ctx = useModalContext();
  const size = sizeProp ?? ctx.size ?? 'md';
  const resolvedAnimation = animationProp ?? ctx.animation ?? 'scale';
  const resolvedBackdropColor = backdropColor ?? ctx.backdropColor ?? 'rgba(0, 0, 0, 0.6)';
  const resolvedBackdropBlur = backdropBlur ?? ctx.backdropBlur ?? 4;
  const resolvedSpring = spring ?? ctx.spring;

  const [render, setRender] = useState(ctx.open);

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const prevOpen = useRef(ctx.open);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSafetyTimer = useCallback(() => {
    if (safetyTimerRef.current !== null) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    if (animatingRef.current) return;
    ctx.onClose();
  }, [ctx]);

  useEscapeKey(closeOnEscape && ctx.open, handleClose);
  const clickOutsideRef = useClickOutside(closeOnBackdropClick && ctx.open, handleClose);

  useEffect(() => {
    if (ctx.open && !prevOpen.current) {
      clearSafetyTimer();
      setRender(true);
      animatingRef.current = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (backdropRef.current && panelRef.current) {
            animateIn(backdropRef.current, panelRef.current, {
              spring: resolvedSpring,
              animation: resolvedAnimation,
              duration: animationDuration,
            });
            setTimeout(() => {
              animatingRef.current = false;
            }, 500);
          }
        });
      });
    } else if (!ctx.open && prevOpen.current) {
      animatingRef.current = true;

      if (backdropRef.current) {
        backdropRef.current.style.pointerEvents = 'none';
      }

      const unmount = () => {
        clearSafetyTimer();
        setRender(false);
        animatingRef.current = false;
      };

      safetyTimerRef.current = setTimeout(unmount, SAFETY_UNMOUNT_MS);

      if (backdropRef.current && panelRef.current) {
        animateOut(backdropRef.current, panelRef.current, {
          spring: resolvedSpring,
          animation: resolvedAnimation,
          duration: animationDuration,
        }).then(unmount);
      } else {
        unmount();
      }
    }
    prevOpen.current = ctx.open;

    return clearSafetyTimer;
  }, [ctx.open, resolvedSpring, resolvedAnimation, animationDuration, clearSafetyTimer]);

  if (!render) return null;

  const setRefs = (el: HTMLDivElement | null) => {
    clickOutsideRef.current = el;
    (panelRef as MutableRefObject<HTMLDivElement | null>).current = el;
  };

  return createPortal(
    <div
      className="rm-backdrop"
      ref={backdropRef}
      style={{
        background: resolvedBackdropColor,
        backdropFilter: `blur(${resolvedBackdropBlur}px)`,
        WebkitBackdropFilter: `blur(${resolvedBackdropBlur}px)`,
      }}
    >
      <div
        ref={setRefs}
        className={`rm-panel rm-panel--${size}${className ? ` ${className}` : ''}`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
