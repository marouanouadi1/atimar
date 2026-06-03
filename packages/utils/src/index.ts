/**
 * ATIMAR — Shared pure logic (@atimar/utils)
 *
 * Court-first filtering / sorting and Italian display formatting.
 * No React, no data source: operates on the shapes from @atimar/types so the
 * same logic runs on mobile and web, and is unit-testable in isolation.
 */

import type { CourtListItem, Filters } from '@atimar/types';

/* ------------------------------------------------------------------ *
 * Filtering & sorting (court-first)
 * ------------------------------------------------------------------ */

/**
 * Filter a list of courts by the active {@link Filters}.
 * `onlyAvailable` is a placeholder until availability slots are wired; it is
 * accepted now so callers/screens don't change later.
 */
export function filterCourts(
  courts: CourtListItem[],
  f: Filters,
): CourtListItem[] {
  let result = courts.slice();
  if (f.sport && f.sport !== 'all') {
    result = result.filter((c) => c.sportId === f.sport);
  }
  if (f.maxDistance) {
    result = result.filter((c) => c.distanceKm <= f.maxDistance);
  }
  if (f.openOnly) {
    result = result.filter((c) => c.open);
  }
  // onlyAvailable: hook to AvailabilitySlot data when available.
  return result;
}

export type CourtSortKey = 'distance' | 'rating' | 'price';

/** Return a new sorted array of courts (does not mutate the input). */
export function sortCourts(
  courts: CourtListItem[],
  by: CourtSortKey = 'distance',
): CourtListItem[] {
  const result = courts.slice();
  switch (by) {
    case 'rating':
      return result.sort((a, b) => b.rating - a.rating);
    case 'price':
      return result.sort((a, b) => a.pricePerHour - b.pricePerHour);
    case 'distance':
    default:
      return result.sort((a, b) => a.distanceKm - b.distanceKm);
  }
}

export const DEFAULT_MAX_DISTANCE = 50;

/** Count active filters for the filter button badge. */
export function countActiveFilters(f: Filters): number {
  return (
    (f.sport !== 'all' ? 1 : 0) +
    (f.maxDistance < DEFAULT_MAX_DISTANCE ? 1 : 0) +
    (f.openOnly ? 1 : 0) +
    (f.onlyAvailable ? 1 : 0)
  );
}

/** Returns a copy of the filters with `active` recomputed. */
export function withActiveCount(f: Filters): Filters {
  return { ...f, active: countActiveFilters(f) };
}

/* ------------------------------------------------------------------ *
 * Italian display formatting
 * ------------------------------------------------------------------ */

/** Format a distance in km using Italian decimal comma, e.g. 1.2 -> "1,2 km". */
export function formatDistanceKm(km: number): string {
  const rounded = Math.round(km * 10) / 10;
  const text = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace('.', ',');
  return `${text} km`;
}

/** Format a price in euro, e.g. 18 -> "€18", 0 -> "Gratis". */
export function formatPrice(value: number): string {
  if (value <= 0) return 'Gratis';
  return `€${value}`;
}

/** Format "from" price, e.g. 18 -> "da €18". */
export function formatPriceFrom(value: number): string {
  if (value <= 0) return 'Gratis';
  return `da €${value}`;
}

/** Format a rating with one Italian decimal, e.g. 4.6 -> "4,6". */
export function formatRating(value: number): string {
  return value.toFixed(1).replace('.', ',');
}

/** Italian pluralization helper: pluralize(2, "campo", "campi") -> "2 campi". */
export function pluralize(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}
