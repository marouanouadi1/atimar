/**
 * Funzioni di mapping pure: righe DB Supabase → shape di dominio @atimar/types.
 *
 * Il DB usa nomi PascalCase italiani, ID numerici e relazioni normalizzate;
 * il modello di dominio usa camelCase italiano, ID stringa e oggetti
 * appiattiti/denormalizzati. Questi mapper collegano i due.
 */

import type {
  Campo,
  CampoInLista,
  FotoStruttura,
  Recensione,
  SportId,
  Struttura,
  TipoHero,
} from "@atimar/types";
import { SPORT_NON_SPECIFICATO, SPORTS } from "@atimar/data";
import { formatPrice, formatDistanceKm } from "@atimar/utils";

/* ------------------------------------------------------------------ *
 * Tipo hero                                                           *
 * ------------------------------------------------------------------ */

export function tipoHeroPerSport(slug: string): TipoHero {
  if (slug === "tennis") return "tennis-clay";
  if (slug === "padel" || slug.startsWith("padel")) return "padel-green";
  if (slug === "calcio" || slug.startsWith("calcio")) return "soccer";
  if (slug.startsWith("beach")) return "beach";
  return "padel-blue";
}

/* ------------------------------------------------------------------ *
 * Geography: lat/lng → MapPoint (relativo 0..1 sul bounding box Italia)
 * ------------------------------------------------------------------ */

const IT_LAT_MIN = 36.5;
const IT_LAT_MAX = 47.1;
const IT_LNG_MIN = 6.6;
const IT_LNG_MAX = 18.5;

export function latLngToMap(lat: number, lng: number) {
  const x = Math.max(0, Math.min(1, (lng - IT_LNG_MIN) / (IT_LNG_MAX - IT_LNG_MIN)));
  const y = Math.max(0, Math.min(1, 1 - (lat - IT_LAT_MIN) / (IT_LAT_MAX - IT_LAT_MIN)));
  return { x, y };
}

/* ------------------------------------------------------------------ *
 * Interfacce righe DB (da select PostgREST embedded)                  *
 * ------------------------------------------------------------------ */

export interface SportRow {
  id: number;
  nome_sport: string;
  slug: string;
}

export interface CampoSportRow {
  fk_campo: number;
  fk_sport: number;
  Sport: SportRow | null;
}

export interface CampoRow {
  id: number;
  fk_struttura: number;
  nome_campo: string;
  tipo_superficie: string | null;
  coperto: boolean | null;
  prezzo_orario: number | null;
  min_giocatori: number | null;
  max_giocatori: number | null;
  attivo: boolean;
  Campi_Sport: CampoSportRow[];
}

export interface ServizioRow {
  id: number;
  nome_servizio: string;
}

export interface StrutturaServizioRow {
  Servizi: ServizioRow | null;
}

export interface RecensioneRow {
  stelle: number;
}

export interface FotoRow {
  url_foto: string;
  copertina: boolean;
  ordine: number;
}

export function mapFotoStruttura(rows: FotoRow[]): {
  foto: FotoStruttura[];
  urlFotoCopertina: string | null;
} {
  const foto = rows
    .filter((f) => {
      try {
        const url = new URL(f.url_foto);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    })
    .map<FotoStruttura>((f) => ({
      urlFoto: f.url_foto,
      copertina: f.copertina,
      ordine: Number.isFinite(f.ordine) ? f.ordine : 0,
    }))
    .sort((a, b) => {
      if (a.copertina !== b.copertina) return a.copertina ? -1 : 1;
      return a.ordine - b.ordine;
    });

  return {
    foto,
    urlFotoCopertina: foto[0]?.urlFoto ?? null,
  };
}

export interface StrutturaWithRelations {
  id: number;
  nome: string;
  descrizione: string | null;
  indirizzo: string;
  latitudine: number;
  longitudine: number;
  /** Nullable: price may be legitimately unknown. */
  prezzo_orario: number | null;
  sempre_aperto: boolean;
  attivo: boolean;
  link_prenotazione_esterno: string | null;
  telefono: string | null;
  link_sito_web: string | null;
  Campi: CampoRow[];
  Strutture_Servizi: StrutturaServizioRow[];
  RecensioniStrutture: RecensioneRow[];
  Foto_Strutture: FotoRow[];
}

export interface RecensioneWithProfilo {
  id: number;
  fk_struttura: number;
  fk_profilo: string;
  stelle: number;
  commento: string | null;
  created_at: string;
  Profili: { nome_completo: string | null } | null;
}

export interface NearbyCampoRow {
  campo_id: number;
  struttura_id: number;
  campo_indice: number | null;
  nome_campo: string;
  nome_struttura: string;
  indirizzo: string;
  latitudine: number;
  longitudine: number;
  distanza_km: number;
  /** Null se il campo non ha alcuno sport associato in Campi_Sport. */
  sport_slug: string | null;
  nome_sport: string | null;
  /** Tutti gli sport associati al campo, in ordine di id. */
  sport_slugs: string[] | null;
  tipo_superficie: string | null;
  coperto: boolean | null;
  prezzo_orario: number | null;
  sempre_aperto: boolean;
  media_voti: number | null;
  numero_recensioni: number | null;
  url_foto_copertina: string | null;
  total_count: number;
}

/* ------------------------------------------------------------------ *
 * Struttura row → Struttura                                           *
 * ------------------------------------------------------------------ */

export function mapRowToStruttura(row: StrutturaWithRelations): Struttura {
  const campiAttivi = row.Campi.filter((c) => c.attivo);

  // Deriva slug sport da tutti i campi attivi — legge Sport.slug direttamente dal DB.
  const slugSet = new Set<SportId>();
  for (const c of campiAttivi) {
    for (const cs of c.Campi_Sport) {
      if (cs.Sport) slugSet.add(cs.Sport.slug as SportId);
    }
  }
  const idSport = Array.from(slugSet);

  // Prezzo da: minimo tra i campi, poi prezzo struttura, poi 0
  const prezziCampi = campiAttivi
    .map((c) => c.prezzo_orario)
    .filter((p): p is number => p != null);
  const prezzoDa =
    prezziCampi.length > 0
      ? Math.min(...prezziCampi)
      : (row.prezzo_orario ?? 0);

  // Media voti dalle recensioni
  const stelle = row.RecensioniStrutture.map((r) => r.stelle);
  const numeroRecensioni = stelle.length;
  const mediaVoti =
    numeroRecensioni > 0
      ? Math.round((stelle.reduce((a, b) => a + b, 0) / numeroRecensioni) * 10) / 10
      : 0;

  const valoriCoperto = campiAttivi.map((c) => c.coperto);
  const coperto = valoriCoperto.includes(true)
    ? true
    : valoriCoperto.length > 0 && valoriCoperto.every((v) => v === false)
      ? false
      : null;

  // Servizi
  const servizi = row.Strutture_Servizi
    .map((ss) => ss.Servizi?.nome_servizio)
    .filter((n): n is string => n != null);

  const lat = row.latitudine;
  const lng = row.longitudine;
  const mappa = latLngToMap(lat, lng);

  const tipoHero = tipoHeroPerSport(idSport[0] ?? "padel");
  const { foto, urlFotoCopertina } = mapFotoStruttura(row.Foto_Strutture ?? []);

  return {
    id: String(row.id),
    nome: row.nome,
    idSport,
    indirizzo: row.indirizzo,
    posizione: { lat, lng },
    mappa,
    // @todo Valorizzare con geolocalizzazione reale dell'utente.
    distanzaKm: 0,
    distanza: "",
    mediaVoti,
    numeroRecensioni,
    sempreAperto: row.sempre_aperto,
    coperto,
    servizi,
    descrizione: row.descrizione ?? "",
    tipoHero,
    foto,
    urlFotoCopertina,
    prezzoDa,
    prezzoDaLabel: prezzoDa > 0 ? formatPrice(prezzoDa) : "Gratuito",
    linkPrenotazione: row.link_prenotazione_esterno ?? null,
    telefono: row.telefono ?? null,
    linkSitoWeb: row.link_sito_web ?? null,
  };
}

/* ------------------------------------------------------------------ *
 * Campo row → Campo                                                   *
 * ------------------------------------------------------------------ */

export function mapRowToCampo(
  campo: CampoRow,
  strutturaAperta = true,
  index = 0,
): Campo {
  // Ordine deterministico per id sport, coerente con l'RPC search_campi_nearby.
  const sports = campo.Campi_Sport
    .map((cs) => cs.Sport)
    .filter((s): s is SportRow => s != null)
    .sort((a, b) => a.id - b.id);
  const sportIds = sports.map((s) => s.slug as SportId);
  const idSport: SportId = sportIds[0] ?? "";

  // Superficie: valore reale dal DB, vuoto se non impostato (no default inventati).
  const superficie = campo.tipo_superficie ?? "";

  const prezzoOrario = campo.prezzo_orario ?? 0;

  // Etichetta sport dall'array SPORTS
  const sportEntry = SPORTS.find((s) => s.id === idSport);
  const nomeSport = sportEntry?.label ?? sports[0]?.nome_sport ?? SPORT_NON_SPECIFICATO;

  return {
    id: String(campo.id),
    strutturaId: String(campo.fk_struttura),
    indice: index + 1,
    nome: campo.nome_campo,
    idSport,
    sportIds,
    nomeSport,
    superficie,
    coperto: campo.coperto,
    prezzoOrario,
    prezzoLabel: formatPrice(prezzoOrario),
    aperto: strutturaAperta,
    minGiocatori: campo.min_giocatori ?? null,
    maxGiocatori: campo.max_giocatori ?? null,
  };
}

/* ------------------------------------------------------------------ *
 * Campo + Struttura → CampoInLista                                    *
 * ------------------------------------------------------------------ */

export function toCampoInLista(campo: Campo, struttura: Struttura): CampoInLista {
  return {
    ...campo,
    nomeStruttura: struttura.nome,
    indirizzo: struttura.indirizzo,
    posizione: struttura.posizione,
    distanzaKm: struttura.distanzaKm,
    distanza: struttura.distanza,
    mediaVoti: struttura.mediaVoti,
    numeroRecensioni: struttura.numeroRecensioni,
    tipoHero: struttura.tipoHero,
    urlFotoCopertina: struttura.urlFotoCopertina,
    mappa: struttura.mappa,
  };
}

export function mapNearbyCampoRowToCampoInLista(row: NearbyCampoRow): CampoInLista {
  const lat = row.latitudine;
  const lng = row.longitudine;
  const distanzaKm = row.distanza_km;
  const prezzoOrario = row.prezzo_orario ?? 0;
  const sportIds = (row.sport_slugs ?? []) as SportId[];
  const idSport: SportId = (row.sport_slug as SportId | null) ?? sportIds[0] ?? "";
  const nomeSport = row.nome_sport ?? SPORT_NON_SPECIFICATO;

  return {
    id: String(row.campo_id),
    strutturaId: String(row.struttura_id),
    indice: row.campo_indice ?? 1,
    nome: row.nome_campo,
    idSport,
    sportIds,
    nomeSport,
    superficie: row.tipo_superficie ?? "",
    coperto: row.coperto,
    prezzoOrario,
    prezzoLabel: formatPrice(prezzoOrario),
    aperto: row.sempre_aperto,
    nomeStruttura: row.nome_struttura,
    indirizzo: row.indirizzo,
    posizione: { lat, lng },
    distanzaKm,
    distanza: formatDistanceKm(distanzaKm),
    mediaVoti: row.media_voti ?? 0,
    numeroRecensioni: row.numero_recensioni ?? 0,
    tipoHero: tipoHeroPerSport(idSport),
    urlFotoCopertina: row.url_foto_copertina,
    mappa: latLngToMap(lat, lng),
  };
}

/* ------------------------------------------------------------------ *
 * RecensioneWithProfilo → Recensione                                  *
 * ------------------------------------------------------------------ */

function tempoRelativo(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  const diff = Date.now() - then;
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Oggi";
  if (days === 1) return "Ieri";
  if (days < 7) return `${days} giorni fa`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 settimana fa";
  if (weeks < 5) return `${weeks} settimane fa`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 mese fa";
  if (months < 12) return `${months} mesi fa`;
  return `${Math.floor(days / 365)} anni fa`;
}

export function mapRowToRecensione(row: RecensioneWithProfilo): Recensione {
  return {
    id: String(row.id),
    strutturaId: String(row.fk_struttura),
    profileId: row.fk_profilo,
    nomeAutore: row.Profili?.nome_completo ?? "Utente",
    stelle: row.stelle,
    quando: tempoRelativo(row.created_at),
    commento: row.commento ?? "",
  };
}

/* ------------------------------------------------------------------ *
 * Re-export helper (usato da altre parti)                             *
 * ------------------------------------------------------------------ */

export { formatDistanceKm };
