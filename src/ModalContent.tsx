import { useState, useRef, useCallback, useEffect, type MutableRefObject, type ReactNode, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useModalContext } from './ModalContext';
import { animateIn, animateOut } from './animate';
import { useEscapeKey } from './hooks/useEscapeKey';
import { useClickOutside } from './hooks/useClickOutside';
import type { SpringPreset, SpringConfig, AnimationVariant } from './spring';

let scrollLockCount = 0;
let savedOverflow = '';

function lockScroll() {
  if (scrollLockCount === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLockCount++;
}

function unlockScroll() {
  scrollLockCount--;
  if (scrollLockCount <= 0) {
    scrollLockCount = 0;
    document.body.style.overflow = savedOverflow;
  }
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll(selectors)) as HTMLElement[];
}

export interface ModalContentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: AnimationVariant;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  backdropColor?: string;
  backdropBlur?: number;
  spring?: SpringPreset | SpringConfig;
  animationDuration?: number;
  preventScroll?: boolean;
}

const SAFETY_UNMOUNT_MS = 600;

export default function ModalContent({
  children,
  className,
  style,
  size: sizeProp,
  animation: animationProp,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  backdropColor,
  backdropBlur,
  spring,
  animationDuration,
  preventScroll: preventScrollProp,
}: ModalContentProps) {
  const ctx = useModalContext();
  const size = sizeProp ?? ctx.size ?? 'md';
  const resolvedAnimation = animationProp ?? ctx.animation ?? 'scale';
  const resolvedBackdropColor = backdropColor ?? ctx.backdropColor ?? 'rgba(0, 0, 0, 0.6)';
  const resolvedBackdropBlur = backdropBlur ?? ctx.backdropBlur ?? 4;
  const resolvedSpring = spring ?? ctx.spring;
  const resolvedPreventScroll = preventScrollProp ?? ctx.preventScroll ?? false;
  const resolvedForceMount = ctx.forceMount ?? false;

  const [render, setRender] = useState(resolvedForceMount || ctx.open);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const prevOpen = useRef(false);
  const transitionIdRef = useRef(0);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSafetyTimer = useCallback(() => {
    if (safetyTimerRef.current !== null) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    ctx.onClose();
  }, [ctx.onClose]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    ctx.onEscapeKeyDown?.(e);
    if (e.defaultPrevented) return;
    handleClose();
  }, [ctx.onEscapeKeyDown, handleClose]);

  const handleInteractOutside = useCallback((e: MouseEvent) => {
    ctx.onInteractOutside?.(e);
    if (e.defaultPrevented) return;
    handleClose();
  }, [ctx.onInteractOutside, handleClose]);

  useEscapeKey(closeOnEscape && ctx.open, handleEscape);
  const clickOutsideRef = useClickOutside(closeOnBackdropClick && ctx.open, handleInteractOutside);

  useEffect(() => {
    if (!ctx.open) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusable = getFocusableElements(panelRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [ctx.open]);

  useEffect(() => {
    const transitionId = ++transitionIdRef.current;

    if (ctx.open && !prevOpen.current) {
      clearSafetyTimer();
      setRender(true);
      animatingRef.current = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (transitionId !== transitionIdRef.current || !ctx.open) return;
          if (backdropRef.current && panelRef.current) {
            const anims = animateIn(backdropRef.current, panelRef.current, {
              spring: resolvedSpring,
              animation: resolvedAnimation,
              duration: animationDuration,
            });
            if (anims.length > 0) {
              Promise.all(anims.map((a) => a.finished))
                .then(() => {
                  if (transitionId === transitionIdRef.current) animatingRef.current = false;
                })
                .catch(() => {
                  if (transitionId === transitionIdRef.current) animatingRef.current = false;
                });
            } else {
              animatingRef.current = false;
            }

            const focusEvent = { defaultPrevented: false, preventDefault() { focusEvent.defaultPrevented = true; } };
            ctx.onOpenAutoFocus?.(focusEvent);
            if (!focusEvent.defaultPrevented) {
              const autoFocusTarget = ctx.initialFocusRef?.current;
              if (autoFocusTarget) {
                autoFocusTarget.focus();
              } else {
                const focusable = getFocusableElements(panelRef.current);
                focusable[0]?.focus();
              }
            }
          }
        });
      });
    } else if (!ctx.open && prevOpen.current) {
      animatingRef.current = true;
      let didUnmount = false;

      const unmount = () => {
        if (didUnmount || transitionId !== transitionIdRef.current) return;
        didUnmount = true;
        clearSafetyTimer();
        setRender(resolvedForceMount);
        animatingRef.current = false;

        const focusEvent = { defaultPrevented: false, preventDefault() { focusEvent.defaultPrevented = true; } };
        ctx.onCloseAutoFocus?.(focusEvent);
        if (!focusEvent.defaultPrevented) {
          const returnTarget = ctx.finalFocusRef?.current ?? ctx.triggerRef.current;
          returnTarget?.focus();
        }
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
    }, [
      ctx.open,
      ctx.onCloseAutoFocus,
      ctx.finalFocusRef,
      ctx.initialFocusRef,
      ctx.triggerRef,
      resolvedSpring,
      resolvedAnimation,
      animationDuration,
      clearSafetyTimer,
      resolvedForceMount,
    ]);

  useEffect(() => {
    if (!resolvedPreventScroll || typeof document === 'undefined') return;

    if (ctx.open) {
      lockScroll();
      return () => unlockScroll();
    }
  }, [ctx.open, resolvedPreventScroll]);

  const setRefs = useCallback((el: HTMLDivElement | null) => {
    clickOutsideRef.current = el;
    (panelRef as MutableRefObject<HTMLDivElement | null>).current = el;
  }, [clickOutsideRef]);

  if (!mounted) return null;

  const isOpen = ctx.open;
  const dataState = isOpen ? 'open' : 'closed';

  const content = (
    <div
      className="rm-backdrop"
      ref={backdropRef}
      data-state={dataState}
      style={{
        zIndex: ctx.zIndex ?? 9998,
        background: resolvedBackdropColor,
        backdropFilter: `blur(${resolvedBackdropBlur}px)`,
        WebkitBackdropFilter: `blur(${resolvedBackdropBlur}px)`,
        visibility: resolvedForceMount && !isOpen ? 'hidden' : undefined,
      }}
    >
      <div
        ref={setRefs}
        id={ctx.dialogId}
        className={`rm-panel rm-panel--${size}${className ? ` ${className}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ctx.labelledById}
        aria-describedby={ctx.describedById}
        data-state={dataState}
        style={{
          zIndex: (ctx.zIndex ?? 9998) + 1,
          ...(resolvedForceMount && !isOpen ? { pointerEvents: 'none' as const } : {}),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );

  if (resolvedForceMount) {
    if (!render) setRender(true);
    return createPortal(content, document.body);
  }

  if (!render) return null;
  return createPortal(content, document.body);
}
