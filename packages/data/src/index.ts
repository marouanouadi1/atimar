/**
 * ATIMAR — @atimar/data
 *
 * Configurazione statica (sport, livelli, giorni, orari, default).
 * I dati di strutture/campi/recensioni vengono da Supabase via @atimar/api.
 */

import type { Filtri, UserPrefs } from "@atimar/types";

export * from "./sports";

/* ------------------------------------------------------------------ *
 * Defaults
 * ------------------------------------------------------------------ */

export const DEFAULT_PREFS: UserPrefs = {
  sports: ["padel", "tennis"],
  area: { location: "", radius: 10 },
  availability: { days: ["Lun", "Mer", "Ven"], times: ["afternoon"] },
};

export const DEFAULT_FILTERS: Filtri = {
  sport: "all",
  distanzaMax: 20,
  soloAperti: false,
  soloApertoAlPubblico: true,
  attivi: 0,
};
