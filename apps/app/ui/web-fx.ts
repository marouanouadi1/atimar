/**
 * Web-only visual effects for the Atimar web experience.
 *
 * Everything here is a no-op on native (returns {} / never fires), so the Expo
 * iOS/Android app is untouched. Effects are delivered with the same primitives
 * already used in the app: CSS `backgroundImage` strings for gradients/glows,
 * RN Web `transition*` style keys for smooth state changes, and Pressable
 * `onHoverIn/onHoverOut` for hover. `prefers-reduced-motion` is respected.
 *
 * Design language: "floodlit court at night" — ink surfaces lit by cobalt and
 * volt glows, light surfaces given real depth instead of flat cream.
 */

import { useEffect, useState } from "react";
import { Platform } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

export const isWeb = Platform.OS === "web";

/**
 * Style usable on both View and Text. Web-only CSS keys (backgroundImage,
 * transition*, backdropFilter…) aren't in RN's types, and `A & B` stays
 * assignable to either `StyleProp<ViewStyle>` or `StyleProp<TextStyle>`.
 */
export type FxStyle = ViewStyle & TextStyle;

/** Shared easing — matches theme.easing.standard. */
export const STD_EASING = "cubic-bezier(0.2, 0.7, 0.2, 1)";

/** Returns the style only on web; {} on native. */
function web<T extends object>(style: T): FxStyle {
  return (isWeb ? style : {}) as unknown as FxStyle;
}

/* ------------------------------------------------------------------ *
 * Elevation — soft layered shadows (web). Native keeps token shadows.
 * ------------------------------------------------------------------ */

export const webElev = {
  /** Resting card elevation. */
  rest: "0 1px 2px rgba(18,20,15,0.05), 0 10px 28px rgba(18,20,15,0.09)",
  /** Hovered card elevation (paired with a small translateY lift). */
  hover: "0 3px 6px rgba(18,20,15,0.08), 0 22px 48px rgba(18,20,15,0.18)",
  /** Floating panel (search cockpit). */
  float: "0 2px 4px rgba(18,20,15,0.06), 0 28px 64px rgba(18,20,15,0.16)",
} as const;

/* ------------------------------------------------------------------ *
 * Transitions
 * ------------------------------------------------------------------ */

export function webTransition(
  property = "transform, box-shadow",
  ms = 200,
  easing = STD_EASING,
): FxStyle {
  return web({
    transitionProperty: property,
    transitionDuration: `${ms}ms`,
    transitionTimingFunction: easing,
  });
}

/* ------------------------------------------------------------------ *
 * Hooks
 * ------------------------------------------------------------------ */

/** Read prefers-reduced-motion, synchronously on first render. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    isWeb && typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    if (!isWeb || typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/**
 * Hover state for a Pressable/Link. Spread `hoverProps` onto the element and
 * read `hovered`. The handlers are valid Pressable props on native too, where
 * they simply never fire.
 */
export function useHover(): {
  hovered: boolean;
  hoverProps: { onHoverIn: () => void; onHoverOut: () => void };
} {
  const [hovered, setHovered] = useState(false);
  return {
    hovered,
    hoverProps: {
      onHoverIn: () => setHovered(true),
      onHoverOut: () => setHovered(false),
    },
  };
}

/**
 * Entrance style for on-load reveals. Spread onto a View. Fades + rises into
 * place once, staggered by `delayMs`. No-op on native and under reduced motion.
 */
export function useEntrance(delayMs = 0): FxStyle {
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!isWeb) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  if (!isWeb || reduced) return {};
  return web({
    opacity: entered ? 1 : 0,
    transform: [{ translateY: entered ? 0 : 16 }],
    transitionProperty: "opacity, transform",
    transitionDuration: "700ms",
    transitionTimingFunction: STD_EASING,
    transitionDelay: `${delayMs}ms`,
  });
}

/** Convenience: card hover-lift. Returns props + the style to apply when hovered. */
export function useLift(dy = -4): {
  hovered: boolean;
  hoverProps: { onHoverIn: () => void; onHoverOut: () => void };
  base: FxStyle;
  lifted: FxStyle;
} {
  const { hovered, hoverProps } = useHover();
  return {
    hovered,
    hoverProps,
    base: webTransition("transform, box-shadow", 220),
    lifted: web({ transform: [{ translateY: dy }], boxShadow: webElev.hover }),
  };
}

/* ------------------------------------------------------------------ *
 * Backgrounds — floodlit-court atmosphere (web only)
 * ------------------------------------------------------------------ */

/** Strong floodlit backdrop for the primary hero (ink base + cobalt/volt glows). */
export const bgFloodlitHero: FxStyle = web({
  backgroundImage: [
    "radial-gradient(115% 85% at 82% 6%, rgba(49,92,255,0.34), transparent 46%)",
    "radial-gradient(90% 80% at 4% 104%, rgba(217,255,67,0.16), transparent 52%)",
    "linear-gradient(158deg, #101208 0%, #15180F 52%, #1A2233 100%)",
  ].join(", "),
});

/** Medium floodlit backdrop for dark panels (gestori CTA, clubs banner). */
export const bgFloodlitPanel: FxStyle = web({
  backgroundImage: [
    "radial-gradient(90% 120% at 92% 8%, rgba(49,92,255,0.30), transparent 42%)",
    "radial-gradient(70% 90% at 2% 100%, rgba(217,255,67,0.12), transparent 55%)",
    "linear-gradient(150deg, #12140F 0%, #191D14 60%, #10131C 100%)",
  ].join(", "),
});

/** Footer backdrop — quieter cobalt wash. */
export const bgFloodlitFooter: FxStyle = web({
  backgroundImage:
    "radial-gradient(70% 140% at 88% -10%, rgba(49,92,255,0.20), transparent 45%), linear-gradient(180deg, #12140F 0%, #0E1013 100%)",
});

/**
 * Subtle warmth for light (cream) sections so they read as lit, not dead-flat.
 * Very low-contrast — depth comes from the cards, not the background.
 */
export const bgWarmLight: FxStyle = web({
  backgroundImage:
    "radial-gradient(80% 60% at 78% -8%, rgba(49,92,255,0.06), transparent 55%), radial-gradient(70% 55% at 0% 8%, rgba(217,255,67,0.10), transparent 52%)",
});

/** Floodlit fill for the empty court-fallback media (turns sad black tiles alive). */
export const bgCourtFallback: FxStyle = web({
  backgroundImage:
    "radial-gradient(75% 70% at 72% 22%, rgba(49,92,255,0.28), transparent 55%), radial-gradient(60% 60% at 20% 96%, rgba(217,255,67,0.16), transparent 60%), linear-gradient(155deg, #14170E 0%, #191E14 100%)",
});
