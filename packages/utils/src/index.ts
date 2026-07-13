/**
 * ATIMAR — @atimar/utils
 *
 * Logica pura condivisa: filtri/ordinamento campi e formattazione display IT.
 * Nessun React, nessuna sorgente dati: opera sulle shape di @atimar/types così
 * la stessa logica gira su mobile, web ed è testabile in isolamento.
 */

import type { CampoInLista, Filtri } from "@atimar/types";

/* ------------------------------------------------------------------ *
 * Filtri e ordinamento (campo-first)
 * ------------------------------------------------------------------ */

/**
 * Filtra una lista di campi applicando i {@link Filtri} attivi.
 * La distanza non viene filtrata qui: quando c'è posizione utente la ricerca
 * usa PostGIS tramite RPC, altrimenti il raggio resta inattivo.
 */
export function filtraCampi(
  campi: CampoInLista[],
  f: Filtri,
): CampoInLista[] {
  let result = campi.slice();
  if (f.sport && f.sport !== "all") {
    // sportIds copre anche i campi polivalenti (più sport sullo stesso campo).
    result = result.filter((c) => c.sportIds.includes(f.sport));
  }
  if (f.soloAperti) {
    result = result.filter((c) => c.aperto);
  }
  if (f.soloApertoAlPubblico) {
    result = result.filter((c) => c.apertoAlPubblico);
  }
  return result;
}

/** Restituisce un nuovo array ordinato (non muta l'input). */
export function ordinaCampi(
  campi: CampoInLista[],
  per: "distanza" | "voti" | "prezzo" = "distanza",
): CampoInLista[] {
  const result = campi.slice();
  switch (per) {
    case "voti":
      return result.sort((a, b) => b.mediaVoti - a.mediaVoti);
    case "prezzo":
      return result.sort((a, b) => a.prezzoOrario - b.prezzoOrario);
    case "distanza":
    default:
      return result.sort((a, b) => a.distanzaKm - b.distanzaKm);
  }
}

// Deve restare allineato a DEFAULT_FILTERS.distanzaMax in @atimar/data.
const DEFAULT_MAX_DISTANCE = 20;
// Deve restare allineato a DEFAULT_FILTERS.soloApertoAlPubblico in @atimar/data.
const DEFAULT_SOLO_APERTO_AL_PUBBLICO = true;

/** Conta i filtri attivi per il badge del pulsante filtri. */
function contaFiltriAttivi(f: Filtri): number {
  return (
    (f.sport !== "all" ? 1 : 0) +
    (f.distanzaMax < DEFAULT_MAX_DISTANCE ? 1 : 0) +
    (f.soloAperti ? 1 : 0) +
    (f.soloApertoAlPubblico !== DEFAULT_SOLO_APERTO_AL_PUBBLICO ? 1 : 0)
  );
}

/** Restituisce una copia dei filtri con `attivi` ricalcolato. */
export function conConteggioAttivo(f: Filtri): Filtri {
  return { ...f, attivi: contaFiltriAttivi(f) };
}

/* ------------------------------------------------------------------ *
 * Formattazione display italiana
 * ------------------------------------------------------------------ */

/** Formatta una distanza in km con virgola italiana, es. 1.2 -> "1,2 km". */
export function formatDistanceKm(km: number): string {
  const rounded = Math.round(km * 10) / 10;
  const text = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace(".", ",");
  return `${text} km`;
}

/** Formatta un prezzo in euro, es. 18 -> "€18", 0 -> "Gratis". */
export function formatPrice(value: number): string {
  if (value <= 0) return "Gratis";
  return `€${value}`;
}

/** Formatta un rating con un decimale italiano, es. 4.6 -> "4,6". */
export function formatRating(value: number): string {
  return value.toFixed(1).replace(".", ",");
}

/** Helper di pluralizzazione italiana: pluralize(2, "campo", "campi") -> "2 campi". */
export function pluralize(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}
