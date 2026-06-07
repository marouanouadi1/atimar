/**
 * Theme access for React Native components.
 * The theme is static for now; `useTheme` keeps the call site future-proof for
 * a light/dark provider later without touching component code.
 */

import type { TextStyle } from "react-native";
import { colors, semantic, tints, typography, theme } from "@/theme/tokens";
import type { Theme, TypographyToken } from "@/theme/tokens";
import type { ColorKey, TintKey } from "./core";

export const tokens: Theme = theme;

export function useTheme(): Theme {
  return theme;
}

/**
 * Resolve a color token name (brand or semantic) to its hex value.
 * If `key` is not a known token it is returned as-is, so raw values such as a
 * `sportColor(id)` hex or an `rgba(...)` string pass through unchanged.
 */
export function resolveColor(key: ColorKey | string): string {
  const brand = colors as Record<string, string>;
  const sem = semantic as Record<string, string>;
  return brand[key] ?? sem[key] ?? key;
}

/** Resolve a soft tint token name to its rgba value. */
export function resolveTint(key: TintKey): string {
  return (tints as Record<string, string>)[key] ?? key;
}

/**
 * Build a React Native `TextStyle` from a typography token, optionally with a
 * resolved color. Keeps screens/components free of hardcoded type metrics.
 */
export function textStyle(
  token: TypographyToken,
  color?: ColorKey | string,
): TextStyle {
  const t = typography[token];
  const base: TextStyle = {
    fontSize: t.fontSize,
    fontWeight: t.fontWeight,
    letterSpacing: t.letterSpacing,
    lineHeight: t.lineHeight,
  };
  return color ? { ...base, color: resolveColor(color) } : base;
}
