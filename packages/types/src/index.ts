/**
 * ATIMAR — Shared product types (@atimar/types)
 *
 * Court-first, normalized model:
 *  - A `Venue` is an informational container (club, public field, standalone).
 *  - A `Court` is the primary discovery entity and ALWAYS has a `venueId`.
 *  - `CourtListItem` is a denormalized view (Court + the Venue fields the UI
 *    needs) returned by selectors, so screens never join data by hand.
 *
 * Derived from MOCK_DATA_CONTRACT.md (design export).
 */

/* ------------------------------------------------------------------ *
 * Sports & levels
 * ------------------------------------------------------------------ */

export type SportId = string;

export interface Sport {
  id: SportId;
  label: string;
  /** Icon name resolved by the UI layer (e.g. @expo/vector-icons). */
  icon: string;
}

export type LevelId = "beginner" | "intermediate" | "advanced" | "expert";

export interface Level {
  id: LevelId;
  title: string;
  desc: string;
  icon: string;
}

/* ------------------------------------------------------------------ *
 * Geometry & visuals
 * ------------------------------------------------------------------ */

/** Graphic placeholder kind for hero / court illustration. */
export type HeroKind =
  | "tennis-clay"
  | "padel-green"
  | "padel-blue"
  | "beach"
  | "soccer";

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Relative position (0..1) on the MapPreview placeholder. */
export interface MapPoint {
  x: number;
  y: number;
}

/* ------------------------------------------------------------------ *
 * Venue (container) & Court (primary entity)
 * ------------------------------------------------------------------ */

/**
 * Venue kind. `public` = campo comunale; `standalone` = single isolated court
 * not part of a real club (still wrapped in a Venue so every Court has a parent).
 */
export type VenueKind = "club" | "public" | "standalone";

export interface Venue {
  id: string;
  name: string;
  kind: VenueKind;
  /** Sports offered across the venue's courts. */
  sportIds: SportId[];
  address: string;
  location: GeoPoint;
  /** Relative position on the map placeholder. */
  map: MapPoint;
  /** Distance from the user — numeric for filters, string for display (IT). */
  distanceKm: number;
  distance: string;
  rating: number;
  reviewsCount: number;
  open: boolean;
  indoor: boolean;
  amenities: string[];
  description: string;
  heroKind: HeroKind;
  /** Cheapest court price (numeric + display). */
  priceFrom: number;
  priceFromLabel: string;
}

export interface Court {
  id: string;
  venueId: string;
  /** 1-based index within its venue. */
  index: number;
  name: string;
  sportId: SportId;
  /** Display label of the sport, e.g. "Padel". */
  sport: string;
  surface: string;
  indoor: boolean;
  pricePerHour: number;
  /** Display price, IT format, e.g. "€18". */
  price: string;
  open: boolean;
}

/**
 * Denormalized court view used by lists, cards, map and favorites.
 * Returned by `@atimar/data` selectors so the UI consumes a single shape.
 */
export interface CourtListItem extends Court {
  venueName: string;
  venueKind: VenueKind;
  address: string;
  distanceKm: number;
  distance: string;
  rating: number;
  reviewsCount: number;
  heroKind: HeroKind;
  map: MapPoint;
}

/* ------------------------------------------------------------------ *
 * Availability & booking
 * ------------------------------------------------------------------ */

export type SlotStatus = "free" | "busy";

export interface AvailabilitySlot {
  id: string;
  venueId: string;
  courtId: string;
  /** ISO date 'YYYY-MM-DD'. */
  date: string;
  /** 'HH:mm'. */
  start: string;
  end: string;
  status: SlotStatus;
  price?: number;
}

export type BookingStatus =
  | "requested"
  | "confirmed"
  | "declined"
  | "cancelled";

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  courtId: string;
  /** 'YYYY-MM-DD'. */
  date: string;
  slot: { start: string; end: string };
  status: BookingStatus;
  note?: string;
  /** ISO timestamp. */
  createdAt: string;
}

/* ------------------------------------------------------------------ *
 * Reviews
 * ------------------------------------------------------------------ */

export interface Review {
  id: string;
  venueId: string;
  name: string;
  rating: number;
  /** Relative display string, e.g. "2 settimane fa". */
  when: string;
  text: string;
}

/* ------------------------------------------------------------------ *
 * User & preferences
 * ------------------------------------------------------------------ */

export interface User {
  name: string;
  email: string;
}

export type DayLabel = "Lun" | "Mar" | "Mer" | "Gio" | "Ven" | "Sab" | "Dom";
export type TimeId = "morning" | "afternoon" | "evening" | "night";

export interface UserPrefs {
  sports: SportId[];
  level?: LevelId;
  area: { location: string; radius: number };
  availability: { days: DayLabel[]; times: TimeId[] };
}

/** Favorites: courts are primary; venues optional (separate section/tab). */
export interface Favorites {
  courtIds: string[];
  venueIds: string[];
}

/* ------------------------------------------------------------------ *
 * Filters
 * ------------------------------------------------------------------ */

export interface Filters {
  sport: "all" | SportId;
  /** km, 1..50. */
  maxDistance: number;
  openOnly: boolean;
  onlyAvailable: boolean;
  /** Number of active filters, for the badge. */
  active: number;
}

/** Onboarding / app phase (mirrors prototype `app.jsx`). */
export type AppPhase = "onboarding" | "auth-register" | "auth-login" | "app";

/** Slide transition direction. */
export type Direction = "forward" | "back";
