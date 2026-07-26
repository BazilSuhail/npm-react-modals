import { resolveSpringConfig, springToWAAPIKeyframes, type SpringPreset, type SpringConfig, type AnimationVariant } from './spring';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface AnimateConfig {
  spring?: SpringPreset | SpringConfig;
  duration?: number;
  animation?: AnimationVariant;
}

const EXIT_MAX_DURATION = 400;

export function animateIn(
  backdropEl: HTMLElement,
  panelEl: HTMLElement,
  config?: AnimateConfig,
): Animation[] {
  const variant = config?.animation ?? 'scale';

  if (prefersReducedMotion() || variant === 'none') {
    backdropEl.style.opacity = '1';
    panelEl.style.opacity = '1';
    panelEl.style.transform = 'none';
    return [];
  }

  const springConfig = resolveSpringConfig(config?.spring);

  const { keyframes: backdropKF, duration: backdropDur } = springToWAAPIKeyframes(0, 1, 'opacity', {
    ...springConfig,
    stiffness: springConfig.stiffness * 0.8,
  });

  const { keyframes: panelKF, duration: panelDur } = springToWAAPIKeyframes(0, 1, 'transform', springConfig, { variant });

  const backdropAnim = backdropEl.animate(backdropKF, {
    duration: backdropDur,
    easing: 'linear',
    fill: 'forwards',
  });

  const panelAnim = panelEl.animate(panelKF, {
    duration: panelDur,
    easing: 'linear',
    fill: 'forwards',
  });

  return [backdropAnim, panelAnim];
}

export function animateOut(
  backdropEl: HTMLElement,
  panelEl: HTMLElement,
  config?: AnimateConfig,
): Promise<void> {
  const variant = config?.animation ?? 'scale';

  if (prefersReducedMotion() || variant === 'none') {
    return Promise.resolve();
  }

  const springConfig = resolveSpringConfig(config?.spring);
  const exitConfig = {
    stiffness: springConfig.stiffness * 2,
    damping: springConfig.damping * 1.5,
    mass: springConfig.mass,
  };

  const { keyframes: backdropKF, duration: backdropDur } = springToWAAPIKeyframes(1, 0, 'opacity', {
    ...exitConfig,
    stiffness: exitConfig.stiffness * 0.8,
  }, { maxDuration: EXIT_MAX_DURATION });

  const { keyframes: panelKF, duration: panelDur } = springToWAAPIKeyframes(1, 0, 'transform', exitConfig, {
    maxDuration: EXIT_MAX_DURATION,
    variant,
  });

  const backdropAnim = backdropEl.animate(backdropKF, {
    duration: backdropDur,
    easing: 'linear',
    fill: 'forwards',
  });

  const panelAnim = panelEl.animate(panelKF, {
    duration: panelDur,
    easing: 'linear',
    fill: 'forwards',
  });

  return Promise.all([backdropAnim.finished, panelAnim.finished]).then(() => {});
}
