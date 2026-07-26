import { resolveSpringConfig, springToWAAPIKeyframes, type SpringPreset, type SpringConfig } from './spring';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface AnimateConfig {
  spring?: SpringPreset | SpringConfig;
  duration?: number;
}

const EXIT_MAX_DURATION = 400;

export function animateIn(
  backdropEl: HTMLElement,
  panelEl: HTMLElement,
  config?: AnimateConfig,
): Animation[] {
  if (prefersReducedMotion()) {
    backdropEl.style.opacity = '1';
    panelEl.style.opacity = '1';
    panelEl.style.transform = 'scale(1)';
    return [];
  }

  const springConfig = resolveSpringConfig(config?.spring);

  const { keyframes: backdropKF, duration: backdropDur } = springToWAAPIKeyframes(0, 1, 'opacity', {
    ...springConfig,
    stiffness: springConfig.stiffness * 0.8,
  });

  const { keyframes: panelKF, duration: panelDur } = springToWAAPIKeyframes(0, 1, 'transform', springConfig);

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
  if (prefersReducedMotion()) {
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
