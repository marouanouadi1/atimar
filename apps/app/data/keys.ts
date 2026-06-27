/** Chiavi cache React Query — centralizzate per evitare typo tra gli hook. */

export const QUERY_KEYS = {
  strutture: () => ["strutture"] as const,
  struttura: (id: string) => ["struttura", id] as const,
  campi: (strutturaId: string) => ["campi", strutturaId] as const,
  recensioni: (strutturaId: string) => ["recensioni", strutturaId] as const,
  preferiti: (profileId: string | null) => ["preferiti", profileId] as const,
} as const;
