/**
 * sportMeta / sportIcon — unified sport visual metadata.
 *
 * Combines the Ionicons glyph from @atimar/data with the brand color from
 * @/theme/tokens so any screen can render a sport chip, badge or map pin
 * with a single import.
 *
 * Usage:
 *   import { sportMeta, sportIcon } from "@/ui";
 *   const { icon, color, label } = sportMeta("padel");
 */

import { SPORT_BY_ID } from "@atimar/data";
import { sportColors, brandFallback } from "@/theme/tokens";

export interface SportMeta {
  icon: string;
  color: string;
  label: string;
}

/** Returns icon, color, and label for a sport id in one call. */
export function sportMeta(sportId: string): SportMeta {
  const sport = SPORT_BY_ID[sportId];
  return {
    icon: sport?.icon ?? "ellipse",
    color: sportColors[sportId] ?? brandFallback,
    label: sport?.label ?? sportId,
  };
}

/** Returns the Ionicons glyph name for a sport id. */
export function sportIcon(sportId: string): string {
  return SPORT_BY_ID[sportId]?.icon ?? "ellipse";
}
