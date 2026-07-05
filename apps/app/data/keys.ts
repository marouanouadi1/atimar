/** Chiavi cache React Query — centralizzate per evitare typo tra gli hook. */

export const QUERY_KEYS = {
  strutture: () => ["strutture"] as const,
  nearbyCampi: (args: {
    lat: number;
    lng: number;
    radiusKm: number;
    sport: string;
    soloAperti: boolean;
    limit: number;
    offset: number;
  }) =>
    [
      "nearby-campi",
      Number(args.lat.toFixed(5)),
      Number(args.lng.toFixed(5)),
      args.radiusKm,
      args.sport,
      args.soloAperti,
      args.limit,
      args.offset,
    ] as const,
  struttura: (id: string) => ["struttura", id] as const,
  campi: (strutturaId: string) => ["campi", strutturaId] as const,
  recensioni: (strutturaId: string) => ["recensioni", strutturaId] as const,
  preferiti: (profileId: string | null) => ["preferiti", profileId] as const,
} as const;
