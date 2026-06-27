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
 * `soloDisponibili` è un placeholder finché i slot disponibilità non sono collegati.
 */
export function filtraCampi(
  campi: CampoInLista[],
  f: Filtri,
): CampoInLista[] {
  let result = campi.slice();
  if (f.sport && f.sport !== "all") {
    result = result.filter((c) => c.idSport === f.sport);
  }
  if (f.distanzaMax) {
    result = result.filter((c) => c.distanzaKm <= f.distanzaMax);
  }
  if (f.soloAperti) {
    result = result.filter((c) => c.aperto);
  }
  // soloDisponibili: hook to AvailabilitySlot data when available.
  return result;
}

export type CampoSortKey = "distanza" | "voti" | "prezzo";

/** Restituisce un nuovo array ordinato (non muta l'input). */
export function ordinaCampi(
  campi: CampoInLista[],
  per: CampoSortKey = "distanza",
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

export const DEFAULT_MAX_DISTANCE = 50;

/** Conta i filtri attivi per il badge del pulsante filtri. */
export function contaFiltriAttivi(f: Filtri): number {
  return (
    (f.sport !== "all" ? 1 : 0) +
    (f.distanzaMax < DEFAULT_MAX_DISTANCE ? 1 : 0) +
    (f.soloAperti ? 1 : 0) +
    (f.soloDisponibili ? 1 : 0)
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

/** Formatta il prezzo "da", es. 18 -> "da €18". */
export function formatPriceFrom(value: number): string {
  if (value <= 0) return "Gratis";
  return `da €${value}`;
}

/** Formatta un rating con un decimale italiano, es. 4.6 -> "4,6". */
export function formatRating(value: number): string {
  return value.toFixed(1).replace(".", ",");
}

/** Helper di pluralizzazione italiana: pluralize(2, "campo", "campi") -> "2 campi". */
export function pluralize(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}
