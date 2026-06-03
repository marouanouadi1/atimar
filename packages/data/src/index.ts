/**
 * ATIMAR — Mock data + court-first selectors (@atimar/data)
 *
 * The UI consumes ONLY these selectors and the @atimar/types shapes.
 * Replacing the mock with Supabase later means reimplementing the selectors as
 * queries — the screens stay untouched. Selectors are synchronous for now;
 * their signatures are easy to wrap in Promises when wiring a real backend.
 */

import type {
  AvailabilitySlot,
  Court,
  CourtListItem,
  Favorites,
  Filters,
  Level,
  Review,
  Sport,
  UserPrefs,
  Venue,
} from '@atimar/types';

import { COURTS, VENUES } from './venues';
import { LEVELS, SPORTS, SPORT_BY_ID, sportLabel } from './sports';

export * from './sports';
export { VENUES, COURTS } from './venues';

/* ------------------------------------------------------------------ *
 * Reviews
 * ------------------------------------------------------------------ */

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    venueId: 'sanpaolo',
    name: 'Marco B.',
    rating: 5,
    when: '2 settimane fa',
    text: 'Campi in terra rossa tenuti benissimo, staff gentile. Torno di sicuro.',
  },
  {
    id: 'r2',
    venueId: 'sanpaolo',
    name: 'Giulia R.',
    rating: 4,
    when: '1 mese fa',
    text: 'Bella struttura e prenotazione facile. Parcheggio un po’ piccolo.',
  },
  {
    id: 'r3',
    venueId: 'greenpadel',
    name: 'Luca P.',
    rating: 5,
    when: '3 giorni fa',
    text: 'Campi padel indoor top, luci perfette anche di sera. Consigliato.',
  },
];

/* ------------------------------------------------------------------ *
 * Defaults (mirror prototype app.jsx)
 * ------------------------------------------------------------------ */

export const DEFAULT_PREFS: UserPrefs = {
  sports: ['padel', 'tennis'],
  area: { location: 'Via Marco Polo, 1, Milano', radius: 10 },
  availability: { days: ['Lun', 'Mer', 'Ven'], times: ['afternoon'] },
};

export const DEFAULT_FILTERS: Filters = {
  sport: 'all',
  maxDistance: 50,
  openOnly: false,
  onlyAvailable: false,
  active: 0,
};

/** Default favorites are court ids (court-first). */
export const DEFAULT_FAVORITES: Favorites = {
  courtIds: ['sanpaolo-c1', 'greenpadel-c1'],
  venueIds: [],
};

/* ------------------------------------------------------------------ *
 * Internal lookups
 * ------------------------------------------------------------------ */

const VENUE_BY_ID: Record<string, Venue> = Object.fromEntries(
  VENUES.map((v) => [v.id, v]),
);

const COURT_BY_ID: Record<string, Court> = Object.fromEntries(
  COURTS.map((c) => [c.id, c]),
);

function toListItem(court: Court): CourtListItem {
  const venue = VENUE_BY_ID[court.venueId];
  return {
    ...court,
    venueName: venue.name,
    venueKind: venue.kind,
    address: venue.address,
    distanceKm: venue.distanceKm,
    distance: venue.distance,
    rating: venue.rating,
    reviewsCount: venue.reviewsCount,
    heroKind: venue.heroKind,
    map: venue.map,
  };
}

const COURT_LIST_ITEMS: CourtListItem[] = COURTS.map(toListItem);

/* ------------------------------------------------------------------ *
 * Selectors — sports & levels
 * ------------------------------------------------------------------ */

export function getSports(): Sport[] {
  return SPORTS;
}

export function getSportById(id: string): Sport | undefined {
  return SPORT_BY_ID[id];
}

export function getLevels(): Level[] {
  return LEVELS;
}

/* ------------------------------------------------------------------ *
 * Selectors — venues
 * ------------------------------------------------------------------ */

export function getVenues(): Venue[] {
  return VENUES.slice();
}

export function getVenueById(id: string): Venue | undefined {
  return VENUE_BY_ID[id];
}

/* ------------------------------------------------------------------ *
 * Selectors — courts (primary entity)
 * ------------------------------------------------------------------ */

/** Raw courts. */
export function getCourts(): Court[] {
  return COURTS.slice();
}

export function getCourtById(id: string): Court | undefined {
  return COURT_BY_ID[id];
}

export function getCourtsByVenue(venueId: string): Court[] {
  return COURTS.filter((c) => c.venueId === venueId);
}

/** Denormalized courts for lists / cards / map / favorites. */
export function getCourtListItems(): CourtListItem[] {
  return COURT_LIST_ITEMS.slice();
}

export function getCourtListItemById(id: string): CourtListItem | undefined {
  return COURT_LIST_ITEMS.find((c) => c.id === id);
}

export function getCourtListItemsByIds(ids: string[]): CourtListItem[] {
  const set = new Set(ids);
  return COURT_LIST_ITEMS.filter((c) => set.has(c.id));
}

/* ------------------------------------------------------------------ *
 * Selectors — reviews
 * ------------------------------------------------------------------ */

export function getReviews(): Review[] {
  return REVIEWS.slice();
}

export function getReviewsByVenue(venueId: string): Review[] {
  return REVIEWS.filter((r) => r.venueId === venueId);
}

/* ------------------------------------------------------------------ *
 * Availability slots (seeded; used by the booking flow)
 * ------------------------------------------------------------------ */

const SLOT_HOURS = ['09:00', '11:00', '15:00', '17:00', '19:00', '21:00'];

/**
 * Generate seeded availability slots for a court on a given date.
 * Occupancy seed matches the prototype detail tab (every 3rd slot busy).
 */
export function getSlotsForCourt(
  courtId: string,
  date: string,
): AvailabilitySlot[] {
  const court = COURT_BY_ID[courtId];
  if (!court) return [];
  return SLOT_HOURS.map((start, i) => {
    const end = `${String(Number(start.slice(0, 2)) + 1).padStart(2, '0')}:00`;
    return {
      id: `${courtId}-${date}-${start}`,
      venueId: court.venueId,
      courtId,
      date,
      start,
      end,
      status: i % 3 === 1 ? 'busy' : 'free',
      price: court.pricePerHour,
    };
  });
}

export { sportLabel };
