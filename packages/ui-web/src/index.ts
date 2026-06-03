/**
 * ATIMAR — Web UI scaffold (@atimar/ui-web)
 *
 * Intentionally minimal for now: the web app is NOT being rewritten in this
 * phase. This package exists so apps/web can already consume the shared design
 * tokens (same palette/typography as mobile) and so React component renderers
 * can be added here later without restructuring the workspace.
 */

import { colors, radius, spacing, typography, webShadows } from '@atimar/theme';

export { theme as webTheme } from '@atimar/theme';

/**
 * Build a flat map of CSS custom properties from the design tokens, e.g.
 * `{ '--atimar-color-primary': '#006EF5', '--atimar-space-lg': '16px', ... }`.
 * Spread into a `:root` style (or emit to a stylesheet) so web styling uses the
 * exact same source of truth as the mobile app.
 */
export function cssVarsFromTheme(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    vars[`--atimar-color-${key}`] = value;
  }
  for (const [key, value] of Object.entries(spacing)) {
    vars[`--atimar-space-${key}`] = `${value}px`;
  }
  for (const [key, value] of Object.entries(radius)) {
    vars[`--atimar-radius-${key}`] = `${value}px`;
  }
  for (const [key, value] of Object.entries(webShadows)) {
    vars[`--atimar-shadow-${key}`] = value;
  }
  for (const [key, value] of Object.entries(typography)) {
    vars[`--atimar-font-size-${key}`] = `${value.fontSize}px`;
  }
  return vars;
}

export const uiWebVersion = '0.1.0';
