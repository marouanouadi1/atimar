/**
 * Hook React Query per il data layer dell'app.
 *
 * Tutti gli hook espongono { data, isLoading, error } da useQuery.
 * Gli hook preferiti accettano il profileId da AppState.
 */

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import type {
  CampoInLista,
  Campo,
  Filtri,
  GeoPoint,
  Struttura,
  Recensione,
} from "@atimar/types";
import "./client";
import { QUERY_KEYS } from "./keys";
import {
  fetchStruttureConCampi,
  searchCampiNearby,
  fetchStrutturaById,
  fetchCampiByStruttura,
  fetchRecensioniByStruttura,
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "@atimar/api";
import type { FavoriteRow } from "@atimar/api";

/* ------------------------------------------------------------------ *
 * Hook catalogo                                                       *
 * ------------------------------------------------------------------ */

export function useCampiInLista() {
  return useQuery({
    queryKey: QUERY_KEYS.strutture(),
    queryFn: fetchStruttureConCampi,
    select: (data) => data.campiInLista,
    staleTime: 5 * 60_000,
  });
}

export function useStrutture() {
  return useQuery({
    queryKey: QUERY_KEYS.strutture(),
    queryFn: fetchStruttureConCampi,
    select: (data) => data.strutture,
    staleTime: 5 * 60_000,
  });
}

/** Deriva un sottoinsieme di CampoInLista dalla query all-strutture in cache. */
export function useCampiInListaByIds(ids: string[]) {
  return useQuery({
    queryKey: QUERY_KEYS.strutture(),
    queryFn: fetchStruttureConCampi,
    select: (data): CampoInLista[] => {
      if (ids.length === 0) return [];
      const set = new Set(ids);
      return data.campiInLista.filter((c) => set.has(c.id));
    },
    staleTime: 5 * 60_000,
  });
}

export function useNearbyCampiInLista({
  location,
  filtri,
  limit = 100,
  offset = 0,
  enabled = true,
}: {
  location: GeoPoint | null;
  filtri: Filtri;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}) {
  const hasLocation = location != null;
  const keyArgs = {
    lat: location?.lat ?? 0,
    lng: location?.lng ?? 0,
    radiusKm: filtri.distanzaMax,
    sport: filtri.sport,
    soloAperti: filtri.soloAperti,
    limit,
    offset,
  };

  return useQuery({
    queryKey: QUERY_KEYS.nearbyCampi(keyArgs),
    queryFn: () =>
      searchCampiNearby({
        lat: location!.lat,
        lng: location!.lng,
        radiusKm: filtri.distanzaMax,
        sport: filtri.sport,
        soloAperti: filtri.soloAperti,
        limit,
        offset,
      }),
    enabled: enabled && hasLocation,
    staleTime: 60_000,
  });
}

/* ------------------------------------------------------------------ *
 * Singola struttura                                                   *
 * ------------------------------------------------------------------ */

export function useStruttura(id: string) {
  return useQuery<Struttura | null>({
    queryKey: QUERY_KEYS.struttura(id),
    queryFn: () => fetchStrutturaById(id),
    enabled: !!id,
    staleTime: 5 * 60_000,
  });
}

/* ------------------------------------------------------------------ *
 * Campi per struttura                                                 *
 * ------------------------------------------------------------------ */

export function useCampiByStruttura(strutturaId: string) {
  return useQuery<Campo[]>({
    queryKey: QUERY_KEYS.campi(strutturaId),
    queryFn: () => fetchCampiByStruttura(strutturaId),
    enabled: !!strutturaId,
    staleTime: 5 * 60_000,
  });
}

/* ------------------------------------------------------------------ *
 * Recensioni per struttura                                            *
 * ------------------------------------------------------------------ */

export function useRecensioni(strutturaId: string) {
  return useQuery<Recensione[]>({
    queryKey: QUERY_KEYS.recensioni(strutturaId),
    queryFn: () => fetchRecensioniByStruttura(strutturaId),
    enabled: !!strutturaId,
    staleTime: 5 * 60_000,
  });
}

/* ------------------------------------------------------------------ *
 * Preferiti                                                           *
 * ------------------------------------------------------------------ */

export function useFavoritesQuery(profileId: string | null) {
  return useQuery<FavoriteRow[]>({
    queryKey: QUERY_KEYS.preferiti(profileId),
    queryFn: () => fetchFavorites(profileId!),
    enabled: !!profileId,
    staleTime: 30_000,
  });
}

export function useTogglePreferitoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profileId,
      campoId,
      isFav,
    }: {
      profileId: string;
      campoId: number;
      isFav: boolean;
    }) => {
      if (isFav) {
        await removeFavorite(profileId, campoId);
      } else {
        await addFavorite(profileId, campoId);
      }
    },
    onMutate: async ({ profileId, campoId, isFav }) => {
      const key = QUERY_KEYS.preferiti(profileId);
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<FavoriteRow[]>(key) ?? [];

      // Aggiornamento ottimistico
      queryClient.setQueryData<FavoriteRow[]>(
        key,
        isFav
          ? prev.filter((f) => f.fk_campo !== campoId)
          : [
              ...prev,
              {
                fk_campo: campoId,
                fk_profilo: profileId,
                created_at: new Date().toISOString(),
                aggiornato_il: new Date().toISOString(),
              },
            ]
      );

      return { prev };
    },
    onError: (_err, { profileId }, context) => {
      if (context?.prev) {
        queryClient.setQueryData(QUERY_KEYS.preferiti(profileId), context.prev);
      }
    },
    onSettled: (_data, _err, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.preferiti(profileId) });
    },
  });
}
