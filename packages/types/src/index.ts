/**
 * ATIMAR — Shared product types (@atimar/types)
 *
 * Modello dominio in italiano, speculare al DB Supabase.
 *  - Una `Struttura` è il contenitore (centro sportivo).
 *  - Un `Campo` è l'entità principale di scoperta e ha SEMPRE uno `strutturaId`.
 *  - `CampoInLista` è una vista denormalizzata (Campo + campi della Struttura
 *    di cui l'UI ha bisogno) restituita dai selettori, così le schermate
 *    non devono mai fare join a mano.
 *
 * Supabase è la fonte di verità; i mapper in @atimar/api convertono le righe
 * DB nelle shape di dominio.
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

/** Tipo hero grafico per illustrazioni del campo/struttura. */
export type TipoHero =
  | "tennis-clay"
  | "padel-green"
  | "padel-blue"
  | "beach"
  | "soccer";

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Posizione relativa (0..1) sul placeholder MapPreview. */
export interface MapPoint {
  x: number;
  y: number;
}

export interface FotoStruttura {
  urlFoto: string;
  copertina: boolean;
  ordine: number;
}

/* ------------------------------------------------------------------ *
 * Struttura (ex Venue) & Campo (ex Court)
 * ------------------------------------------------------------------ */

export interface Struttura {
  id: string;
  nome: string;
  /** IDs degli sport offerti attraverso i campi della struttura. */
  idSport: SportId[];
  indirizzo: string;
  posizione: GeoPoint;
  /** Posizione relativa sul placeholder della mappa. */
  mappa: MapPoint;
  /** Distanza dall'utente — numerica per i filtri, stringa per display (IT).
   * @todo Valorizzare con geolocalizzazione reale dell'utente. */
  distanzaKm: number;
  distanza: string;
  mediaVoti: number;
  numeroRecensioni: number;
  sempreAperto: boolean;
  coperto: boolean | null;
  servizi: string[];
  descrizione: string;
  tipoHero: TipoHero;
  foto: FotoStruttura[];
  urlFotoCopertina: string | null;
  /** Prezzo più basso tra i campi (numerico + display). */
  prezzoDa: number;
  prezzoDaLabel: string;
  /** URL prenotazione esterna (Strutture.link_prenotazione_esterno). */
  linkPrenotazione?: string | null;
  /** Telefono (Strutture.telefono). */
  telefono?: string | null;
  /** Sito web della struttura (Strutture.link_sito_web). */
  linkSitoWeb?: string | null;
}

export interface Campo {
  id: string;
  strutturaId: string;
  /** Indice 1-based all'interno della struttura. */
  indice: number;
  nome: string;
  /** Sport primario, usato per badge/icona singola (es. card, marker mappa). */
  idSport: SportId;
  /** Tutti gli sport associati al campo — i campi polivalenti ne hanno più di uno; usare questo per i filtri. */
  sportIds: SportId[];
  /** Etichetta display dello sport, es. "Padel". */
  nomeSport: string;
  /** Tipo superficie, reale dal DB o vuoto se non impostato. */
  superficie: string;
  coperto: boolean | null;
  prezzoOrario: number;
  /** Prezzo formattato IT, es. "€18". */
  prezzoLabel: string;
  aperto: boolean;
}

/**
 * Vista denormalizzata del campo usata da liste, card, mappa e preferiti.
 * Restituita dai selettori così l'UI consuma una sola shape.
 */
export interface CampoInLista extends Campo {
  nomeStruttura: string;
  indirizzo: string;
  posizione: GeoPoint;
  distanzaKm: number;
  distanza: string;
  mediaVoti: number;
  numeroRecensioni: number;
  tipoHero: TipoHero;
  urlFotoCopertina: string | null;
  mappa: MapPoint;
}

/* ------------------------------------------------------------------ *
 * Recensioni
 * ------------------------------------------------------------------ */

export interface Recensione {
  id: string;
  strutturaId: string;
  profileId: string;
  nomeAutore: string;
  stelle: number;
  /** Stringa relativa display, es. "2 settimane fa". */
  quando: string;
  commento: string;
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

/** Preferiti: campi salvati per utente in Campi_Preferiti (Supabase). */
export interface Preferiti {
  campoIds: string[];
}

/* ------------------------------------------------------------------ *
 * Filtri
 * ------------------------------------------------------------------ */

export interface Filtri {
  sport: "all" | SportId;
  /** km, 1..50.
   * @todo Filtrare per distanza reale quando disponibile. */
  distanzaMax: number;
  soloAperti: boolean;
  /** Numero di filtri attivi, per il badge. */
  attivi: number;
}
