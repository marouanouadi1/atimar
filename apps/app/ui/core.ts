/**
 * Shared UI specs and hooks for the local React Native UI layer.
 *
 * Specs map component variants to design-token names. Hooks keep simple UI
 * state patterns reusable across app screens without adding another package.
 */

import { useCallback, useMemo, useState } from 'react';
import { layout } from '@/theme/tokens';
import type { ColorToken, SemanticToken, ShadowToken } from '@/theme/tokens';

/* ------------------------------------------------------------------ *
 * Shared token key unions
 * ------------------------------------------------------------------ */

export type ColorKey = ColorToken | SemanticToken;
export type TintKey =
  | 'limeTint'
  | 'limeTintSoft'
  | 'blueTint'
  | 'inkTint'
  | 'successTint';

/* ------------------------------------------------------------------ *
 * Button
 * ------------------------------------------------------------------ */

export type ButtonVariant = 'primary' | 'lime' | 'ghost';

export interface ButtonSpec {
  /** Background color token; `undefined` means transparent. */
  bg?: ColorKey;
  /** Foreground (text/icon) color token. */
  fg: ColorKey;
  shadow?: ShadowToken;
  border?: ColorKey;
  height: number;
}

export function resolveButtonSpec(
  variant: ButtonVariant,
  disabled = false,
): ButtonSpec {
  if (disabled) {
    return { bg: 'disabled', fg: 'surface', height: layout.ctaHeight };
  }
  switch (variant) {
    case 'lime':
      return { bg: 'lime', fg: 'ink', shadow: 'lime', height: layout.ctaHeight };
    case 'ghost':
      return { fg: 'primary', height: layout.ghostHeight };
    case 'primary':
    default:
      return { bg: 'primary', fg: 'surface', shadow: 'cta', height: layout.ctaHeight };
  }
}

/* ------------------------------------------------------------------ *
 * Availability badge
 * ------------------------------------------------------------------ */

export type AvailabilityState = 'open' | 'closed' | 'free' | 'busy';

export interface AvailabilitySpec {
  label: string;
  fg: ColorKey;
  tint: TintKey;
}

export function resolveAvailabilitySpec(
  state: AvailabilityState,
): AvailabilitySpec {
  switch (state) {
    case 'open':
      return { label: 'Aperto', fg: 'success', tint: 'successTint' };
    case 'free':
      return { label: 'Libero', fg: 'success', tint: 'successTint' };
    case 'busy':
      return { label: 'Occupato', fg: 'muted', tint: 'inkTint' };
    case 'closed':
    default:
      return { label: 'Chiuso', fg: 'muted', tint: 'inkTint' };
  }
}

/* ------------------------------------------------------------------ *
 * IconBadge tones
 * ------------------------------------------------------------------ */

export type IconBadgeTone = 'lime' | 'blue' | 'ink' | 'success';

export interface IconBadgeSpec {
  fg: ColorKey;
  tint: TintKey;
}

export function resolveIconBadgeSpec(tone: IconBadgeTone): IconBadgeSpec {
  switch (tone) {
    case 'blue':
      return { fg: 'primary', tint: 'blueTint' };
    case 'success':
      return { fg: 'success', tint: 'successTint' };
    case 'ink':
      return { fg: 'ink', tint: 'inkTint' };
    case 'lime':
    default:
      return { fg: 'limeDark', tint: 'limeTint' };
  }
}

/* ------------------------------------------------------------------ *
 * Other shared variant unions
 * ------------------------------------------------------------------ */

export type CourtCardVariant = 'large' | 'compact';
export type MapPinVariant = 'default' | 'selected' | 'compact';
export type ProgressVariant = 'pill' | 'dots' | 'bar';
export type FilterChipVariant = 'pill' | 'segment';

/* ------------------------------------------------------------------ *
 * Hooks - disclosure (sheets, modals, dropdowns)
 * ------------------------------------------------------------------ */

export interface Disclosure {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (v: boolean) => void;
}

export function useDisclosure(initial = false): Disclosure {
  const [isOpen, setOpen] = useState(initial);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  return { isOpen, open, close, toggle, setOpen };
}

/* ------------------------------------------------------------------ *
 * Hooks - stepper (onboarding / setup wizard)
 * ------------------------------------------------------------------ */

export interface Stepper {
  step: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  /** Completion ratio 0..1. */
  progress: number;
  next: () => void;
  prev: () => void;
  goTo: (step: number) => void;
}

export function useStepper(total: number, initial = 1): Stepper {
  const [step, setStep] = useState(initial);
  const clamp = useCallback(
    (n: number) => Math.min(Math.max(n, 1), total),
    [total],
  );
  const next = useCallback(() => setStep((s) => Math.min(s + 1, total)), [total]);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);
  const goTo = useCallback((n: number) => setStep(clamp(n)), [clamp]);
  return {
    step,
    total,
    isFirst: step <= 1,
    isLast: step >= total,
    progress: total > 0 ? step / total : 0,
    next,
    prev,
    goTo,
  };
}

/* ------------------------------------------------------------------ *
 * Hooks - selection set (sports, days, time-of-day)
 * ------------------------------------------------------------------ */

export interface ToggleSet<T> {
  values: T[];
  has: (value: T) => boolean;
  toggle: (value: T) => void;
  clear: () => void;
  set: (values: T[]) => void;
  count: number;
}

export function useToggleSet<T>(initial: T[] = []): ToggleSet<T> {
  const [values, setValues] = useState<T[]>(initial);
  const has = useCallback((v: T) => values.includes(v), [values]);
  const toggle = useCallback(
    (v: T) =>
      setValues((prev) =>
        prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
      ),
    [],
  );
  const clear = useCallback(() => setValues([]), []);
  const set = useCallback((next: T[]) => setValues(next), []);
  return useMemo(
    () => ({ values, has, toggle, clear, set, count: values.length }),
    [values, has, toggle, clear, set],
  );
}
