/**
 * Hook React Query per il data layer dell'app.
 *
 * Tutti gli hook espongono { data, isLoading, error } da useQuery.
 * Gli hook preferiti accettano il profileId da AppState.
 */

import {
  useQueryClient,
  useQuery,
  useMutation,
  keepPreviousData,
} from "@tanstack/react-query";
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
  createRecensione,
  updateRecensione,
  createFeedbackApp,
  getInviteByProfile,
  markInviteShared,
  upsertInviteForProfile,
} from "@atimar/api";
import type { FavoriteRow } from "@atimar/api";

type SubmitFeedbackInput = {
  profileId: string;
  categoria: string;
  messaggio: string;
  emailContatto?: string | null;
  piattaforma?: string | null;
  versioneApp?: string | null;
};

type PrepareInviteInput = {
  profileId: string;
  appUrl?: string;
};

export type SubmitRecensioneInput = {
  strutturaId: string;
  profileId: string;
  stelle: number;
  commento: string;
  recensioneId?: string;
};

function sanitizeAppUrl(value?: string): string {
  const fallback = "https://atimar.app";
  const raw = value?.trim() || fallback;
  return raw.replace(/\/+$/, "");
}

function createInviteCode(profileId: string): string {
  const seed = `${profileId}-${Date.now()}-${Math.random()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return `ATIMAR-${Math.abs(hash).toString(36).toUpperCase()}`;
}

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
    placeholderData: keepPreviousData,
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

export function useSubmitRecensioneMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      strutturaId,
      profileId,
      stelle,
      commento,
      recensioneId,
    }: SubmitRecensioneInput) => {
      if (!Number.isInteger(stelle) || stelle < 1 || stelle > 5) {
        throw new Error("Seleziona un voto da 1 a 5 stelle");
      }

      const fkStruttura = Number(strutturaId);
      if (!Number.isFinite(fkStruttura)) {
        throw new Error("Struttura non valida");
      }

      const commentoPulito = commento.trim();
      const payload = {
        stelle,
        commento: commentoPulito.length > 0 ? commentoPulito : null,
      };

      const result = recensioneId
        ? await updateRecensione(Number(recensioneId), payload)
        : await createRecensione({
            fk_struttura: fkStruttura,
            fk_profilo: profileId,
            ...payload,
          });

      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (_data, { strutturaId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recensioni(strutturaId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.struttura(strutturaId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.strutture() });
    },
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

/* ------------------------------------------------------------------ *
 * Feedback e inviti                                                   *
 * ------------------------------------------------------------------ */

export function useSubmitFeedbackMutation() {
  return useMutation({
    mutationFn: async ({
      profileId,
      categoria,
      messaggio,
      emailContatto,
      piattaforma,
      versioneApp,
    }: SubmitFeedbackInput) => {
      const { error } = await createFeedbackApp({
        fk_profilo: profileId,
        categoria,
        messaggio,
        email_contatto: emailContatto ?? null,
        piattaforma: piattaforma ?? null,
        versione_app: versioneApp ?? null,
      });

      if (error) throw error;
    },
  });
}

export function useInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profileId, appUrl }: PrepareInviteInput) => {
      const inviteUrl = sanitizeAppUrl(appUrl);
      const existing = await getInviteByProfile(profileId);

      if (existing.error) throw existing.error;

      const codice = createInviteCode(profileId);
      const created = existing.data
        ? null
        : await upsertInviteForProfile({
            fk_profilo: profileId,
            codice,
            link: `${inviteUrl}?ref=${codice}`,
          });

      if (created?.error) throw created.error;

      const invito = existing.data ?? created?.data;

      if (!invito) {
        throw new Error("Impossibile preparare il link di invito");
      }

      const shared = await markInviteShared(profileId, invito.codice);
      if (shared.error) throw shared.error;

      return shared.data ?? invito;
    },
    onSuccess: (data, { profileId }) => {
      queryClient.setQueryData(QUERY_KEYS.invito(profileId), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invito(profileId) });
    },
  });
}
