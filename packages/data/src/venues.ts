/**
 * Venues (containers) and the Courts generated inside them.
 *
 * Court-first model: every Court has a `venueId`. Public/standalone fields are
 * still wrapped in a Venue (kind 'public' | 'standalone') so the parent link
 * always exists. Faithful to the 6 entries of the prototype's COURTS, expanded
 * into individual courts.
 */

import type { Court, SportId, Venue, VenueKind, HeroKind } from '@atimar/types';
import { formatDistanceKm, formatPrice } from '@atimar/utils';
import { sportLabel } from './sports';

interface CourtSpec {
  sportId: SportId;
  pricePerHour: number;
  surface?: string;
}

interface VenueSeed {
  id: string;
  name: string;
  kind: VenueKind;
  address: string;
  location: { lat: number; lng: number };
  map: { x: number; y: number };
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  open: boolean;
  indoor: boolean;
  amenities: string[];
  description: string;
  heroKind: HeroKind;
  courts: CourtSpec[];
}

/** Default surface by sport, used when a court spec doesn't override it. */
function surfaceFor(sportId: SportId, indoor: boolean): string {
  if (sportId === 'tennis') return 'Terra rossa';
  if (sportId.startsWith('padel')) return indoor ? 'Cristal' : 'Sintetico';
  if (sportId.startsWith('calcio')) return 'Erba sintetica';
  if (sportId === 'beachvolley' || sportId === 'beachtennis') return 'Sabbia';
  if (sportId === 'basket') return 'Parquet';
  return 'Sintetico';
}

const SEEDS: VenueSeed[] = [
  {
    id: 'sanpaolo',
    name: 'San Paolo Tennis Club',
    kind: 'club',
    address: 'Via Roma 42, Milano',
    location: { lat: 45.4642, lng: 9.19 },
    map: { x: 0.32, y: 0.38 },
    distanceKm: 1.2,
    rating: 4.6,
    reviewsCount: 124,
    open: true,
    indoor: false,
    amenities: ['Spogliatoi', 'Bar', 'Parcheggio', 'Illuminazione'],
    description:
      'Storico circolo con campi in terra rossa curati, scuola tennis e area bar. A pochi minuti dal centro.',
    heroKind: 'tennis-clay',
    courts: [
      { sportId: 'tennis', pricePerHour: 18 },
      { sportId: 'tennis', pricePerHour: 18 },
      { sportId: 'tennis', pricePerHour: 20 },
      { sportId: 'tennis', pricePerHour: 22 },
    ],
  },
  {
    id: 'greenpadel',
    name: 'Green Padel Center',
    kind: 'club',
    address: 'Viale Monza 88, Milano',
    location: { lat: 45.498, lng: 9.226 },
    map: { x: 0.58, y: 0.27 },
    distanceKm: 2.1,
    rating: 4.8,
    reviewsCount: 96,
    open: true,
    indoor: true,
    amenities: ['Spogliatoi', 'Bar', 'Parcheggio', 'Pro shop', 'Indoor'],
    description:
      'Centro padel indoor di nuova generazione, sei campi panoramici e prenotazione rapida.',
    heroKind: 'padel-green',
    courts: [
      { sportId: 'padel', pricePerHour: 24 },
      { sportId: 'padel', pricePerHour: 24 },
      { sportId: 'padel', pricePerHour: 24 },
      { sportId: 'padel', pricePerHour: 28 },
      { sportId: 'padel', pricePerHour: 28 },
      { sportId: 'padel', pricePerHour: 28 },
    ],
  },
  {
    id: 'arenacity',
    name: 'Arena City Sport',
    kind: 'club',
    address: 'Via Padova 210, Milano',
    location: { lat: 45.512, lng: 9.235 },
    map: { x: 0.7, y: 0.55 },
    distanceKm: 3.4,
    rating: 4.3,
    reviewsCount: 58,
    open: true,
    indoor: false,
    amenities: ['Spogliatoi', 'Parcheggio', 'Illuminazione', 'Tribune'],
    description:
      'Impianto polivalente per calcio a 5 e a 7, manto sintetico di ultima generazione e tribune.',
    heroKind: 'soccer',
    courts: [
      { sportId: 'calcio5', pricePerHour: 50 },
      { sportId: 'calcio5', pricePerHour: 50 },
      { sportId: 'calcio7', pricePerHour: 70 },
    ],
  },
  {
    id: 'bluepadel',
    name: 'Blue Padel Lab',
    kind: 'club',
    address: 'Via Tortona 15, Milano',
    location: { lat: 45.451, lng: 9.16 },
    map: { x: 0.22, y: 0.62 },
    distanceKm: 2.8,
    rating: 4.5,
    reviewsCount: 73,
    open: false,
    indoor: true,
    amenities: ['Spogliatoi', 'Bar', 'Indoor', 'Aria condizionata'],
    description:
      'Quattro campi panoramici indoor, perfetti tutto l’anno. Lezioni con maestri certificati.',
    heroKind: 'padel-blue',
    courts: [
      { sportId: 'padel', pricePerHour: 22 },
      { sportId: 'padel', pricePerHour: 22 },
      { sportId: 'padel', pricePerHour: 26 },
      { sportId: 'padel', pricePerHour: 26 },
    ],
  },
  {
    id: 'lidobeach',
    name: 'Lido Beach Arena',
    kind: 'club',
    address: 'Via Ripamonti 300, Milano',
    location: { lat: 45.43, lng: 9.21 },
    map: { x: 0.45, y: 0.78 },
    distanceKm: 4.6,
    rating: 4.4,
    reviewsCount: 41,
    open: true,
    indoor: false,
    amenities: ['Spogliatoi', 'Bar', 'Sabbia', 'Eventi'],
    description:
      'Campi sulla sabbia per beach volley e beach tennis, atmosfera estiva tutto l’anno.',
    heroKind: 'beach',
    courts: [
      { sportId: 'beachvolley', pricePerHour: 16 },
      { sportId: 'beachvolley', pricePerHour: 16 },
      { sportId: 'beachvolley', pricePerHour: 16 },
      { sportId: 'beachtennis', pricePerHour: 20 },
      { sportId: 'beachtennis', pricePerHour: 20 },
    ],
  },
  {
    id: 'comunalegiuriati',
    name: 'Campo Comunale Giuriati',
    kind: 'public',
    address: 'Piazza Leonardo da Vinci, Milano',
    location: { lat: 45.478, lng: 9.227 },
    map: { x: 0.6, y: 0.42 },
    distanceKm: 1.9,
    rating: 4.0,
    reviewsCount: 22,
    open: true,
    indoor: false,
    amenities: ['Accesso libero', 'Illuminazione'],
    description:
      'Campo pubblico comunale, accesso libero o a tariffa simbolica. Ideale per partite tra amici.',
    heroKind: 'soccer',
    courts: [
      { sportId: 'calcio', pricePerHour: 0 },
      { sportId: 'tennis', pricePerHour: 10 },
    ],
  },
];

/** Build the full Venue + Court catalogs from the seeds. */
function build(): { venues: Venue[]; courts: Court[] } {
  const venues: Venue[] = [];
  const courts: Court[] = [];

  for (const seed of SEEDS) {
    const sportIds = Array.from(new Set(seed.courts.map((c) => c.sportId)));
    const priceFrom = Math.min(...seed.courts.map((c) => c.pricePerHour));

    venues.push({
      id: seed.id,
      name: seed.name,
      kind: seed.kind,
      sportIds,
      address: seed.address,
      location: seed.location,
      map: seed.map,
      distanceKm: seed.distanceKm,
      distance: formatDistanceKm(seed.distanceKm),
      rating: seed.rating,
      reviewsCount: seed.reviewsCount,
      open: seed.open,
      indoor: seed.indoor,
      amenities: seed.amenities,
      description: seed.description,
      heroKind: seed.heroKind,
      priceFrom,
      priceFromLabel: formatPrice(priceFrom),
    });

    seed.courts.forEach((spec, i) => {
      const index = i + 1;
      courts.push({
        id: `${seed.id}-c${index}`,
        venueId: seed.id,
        index,
        name: `Campo ${index}`,
        sportId: spec.sportId,
        sport: sportLabel(spec.sportId),
        surface: spec.surface ?? surfaceFor(spec.sportId, seed.indoor),
        indoor: seed.indoor,
        pricePerHour: spec.pricePerHour,
        price: formatPrice(spec.pricePerHour),
        open: seed.open,
      });
    });
  }

  return { venues, courts };
}

const built = build();

export const VENUES: Venue[] = built.venues;
export const COURTS: Court[] = built.courts;
