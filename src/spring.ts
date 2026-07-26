export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export type SpringPreset = 'default' | 'gentle' | 'wobbly' | 'stiff' | 'slow';

const PRESETS: Record<SpringPreset, SpringConfig> = {
  default: { stiffness: 100, damping: 10, mass: 1 },
  gentle: { stiffness: 100, damping: 20, mass: 1 },
  wobbly: { stiffness: 200, damping: 10, mass: 1 },
  stiff: { stiffness: 400, damping: 30, mass: 1 },
  slow: { stiffness: 50, damping: 20, mass: 1 },
};

const VELOCITY_THRESHOLD = 0.001;
const DISPLACEMENT_THRESHOLD = 0.001;
const MAX_SIMULATION_STEPS = 1200;
const FIXED_DT = 1 / 120;

export function resolveSpringConfig(input?: SpringPreset | Partial<SpringConfig>): SpringConfig {
  if (!input) return PRESETS.default;
  if (typeof input === 'string') return PRESETS[input] ?? PRESETS.default;
  return { ...PRESETS.default, ...input };
}

function isAtRest(value: number, velocity: number, target: number): boolean {
  return (
    Math.abs(velocity) < VELOCITY_THRESHOLD &&
    Math.abs(value - target) < DISPLACEMENT_THRESHOLD
  );
}

export interface GenerateOptions {
  maxDuration?: number;
}

export function generateSpringKeyframes(
  from: number,
  to: number,
  config: SpringConfig,
  options?: GenerateOptions,
): { keyframes: number[]; duration: number } {
  const { stiffness, damping, mass } = config;
  const maxSteps = options?.maxDuration
    ? Math.min(MAX_SIMULATION_STEPS, Math.ceil((options.maxDuration / 1000) / FIXED_DT))
    : MAX_SIMULATION_STEPS;

  let value = from;
  let velocity = 0;
  const positions: number[] = [from];
  let steps = 0;

  while (steps < maxSteps) {
    if (isAtRest(value, velocity, to)) {
      positions.push(to);
      break;
    }

    const displacement = value - to;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * velocity;
    const acceleration = (springForce + dampingForce) / mass;

    velocity += acceleration * FIXED_DT;
    value += velocity * FIXED_DT;
    positions.push(value);
    steps++;
  }

  if (steps >= maxSteps) {
    positions.push(to);
  }

  const duration = steps * FIXED_DT * 1000;
  return { keyframes: positions, duration };
}

export interface WAAPIKeyframeOptions {
  maxDuration?: number;
}

export function springToWAAPIKeyframes(
  fromValue: number,
  toValue: number,
  property: 'opacity' | 'transform',
  config: SpringConfig,
  options?: WAAPIKeyframeOptions,
): { keyframes: Keyframe[]; duration: number } {
  const { keyframes: positions, duration } = generateSpringKeyframes(fromValue, toValue, config, options);

  const waapiKeyframes: Keyframe[] = positions.map((pos, i) => {
    const offset = i / (positions.length - 1);

    if (property === 'opacity') {
      return { opacity: String(pos), offset } as Keyframe;
    }

    const scale = 0.95 + 0.05 * pos;
    return {
      transform: `scale(${scale})`,
      opacity: String(pos),
      offset,
    } as Keyframe;
  });

  return { keyframes: waapiKeyframes, duration };
}
