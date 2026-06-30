/**
 * Stato globale dell'app — persistito in AsyncStorage, con sessione Supabase
 * e preferiti basati su React Query.
 *
 * Auth (user / profileId) è derivato dalla sessione Supabase, quindi sopravvive
 * ai reload senza round-trip aggiuntivi.
 * I preferiti dei campi sono in Campi_Preferiti (per utenti loggati).
 * Prefs, filtri e stato onboarding rimangono locali (AsyncStorage).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { DEFAULT_FILTERS, DEFAULT_PREFS } from "@atimar/data";
import { conConteggioAttivo } from "@atimar/utils";
import type {
  Filtri,
  Preferiti,
  User,
  UserPrefs,
} from "@atimar/types";
import { clearPersisted, loadPersisted, savePersisted } from "./storage";
import type { LoginInput, RegisterInput } from "./auth";
import { signIn, signOut, signUp, signInWithGoogle } from "./auth";
import type { AuthResult, OAuthResult } from "./auth";
import { supabase } from "@/data/client";
import { QUERY_KEYS } from "@/data/keys";
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "@atimar/api";
import type { FavoriteRow } from "@atimar/api";

/* ------------------------------------------------------------------ *
 * Stato persistito                                                    *
 * ------------------------------------------------------------------ */

interface PersistedState {
  onboarded: boolean;
  prefs: UserPrefs;
  filters: Filtri;
}

const INITIAL_PERSISTED: PersistedState = {
  onboarded: false,
  prefs: DEFAULT_PREFS,
  filters: DEFAULT_FILTERS,
};

/* ------------------------------------------------------------------ *
 * Valore del context                                                  *
 * ------------------------------------------------------------------ */

interface AppStateValue {
  ready: boolean;
  user: User | null;
  /** Supabase auth.users UUID — null quando non loggato. */
  profileId: string | null;
  onboarded: boolean;
  prefs: UserPrefs;
  preferiti: Preferiti;
  filtri: Filtri;
  completeOnboarding: (prefs?: UserPrefs) => void;
  setPrefs: (patch: Partial<UserPrefs>) => void;
  register: (input: RegisterInput) => Promise<AuthResult>;
  login: (input: LoginInput) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<OAuthResult>;
  logout: () => void;
  togglePreferitoCampo: (campoId: string) => Promise<void>;
  isPreferitoCampo: (campoId: string) => boolean;
  setFiltri: (filtri: Filtri) => void;
  resetFiltri: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function profileNameFromSession(s: Session): string {
  const meta = s.user.user_metadata as Record<string, unknown>;
  return (
    (meta?.full_name as string | undefined) ??
    (meta?.name as string | undefined) ??
    s.user.email?.split("@")[0] ??
    "Atleta"
  );
}

function profileAvatarFromSession(s: Session): string | undefined {
  const meta = s.user.user_metadata as Record<string, unknown>;
  return (
    (meta?.avatar_url as string | undefined) ??
    (meta?.picture as string | undefined)
  );
}

async function ensureProfileForSession(s: Session): Promise<void> {
  const url_avatar = profileAvatarFromSession(s);
  const { error } = await supabase
    .from("Profili")
    .upsert(
      {
        id: s.user.id,
        nome_completo: profileNameFromSession(s),
        ...(url_avatar ? { url_avatar } : {}),
      },
      { onConflict: "id", ignoreDuplicates: true }
    );

  if (error) console.error("[Profili] ensure error:", error);
}

function scheduleProfileEnsure(s: Session): void {
  setTimeout(() => {
    void ensureProfileForSession(s);
  }, 0);
}

/* ------------------------------------------------------------------ *
 * Provider                                                            *
 * ------------------------------------------------------------------ */

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedState>(INITIAL_PERSISTED);
  const [persistedReady, setPersistedReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const hydratedRef = useRef(false);
  const queryClient = useQueryClient();

  const ready = persistedReady && sessionReady;

  // ── Idratazione stato persistito ────────────────────────────────────
  useEffect(() => {
    let active = true;
    loadPersisted<Partial<PersistedState>>().then((saved) => {
      if (!active) return;
      if (saved) setPersisted((prev) => ({ ...prev, ...saved }));
      hydratedRef.current = true;
      setPersistedReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // ── Persistenza ad ogni cambio dopo l'idratazione ───────────────────
  useEffect(() => {
    if (!hydratedRef.current) return;
    void savePersisted(persisted);
  }, [persisted]);

  // ── Sessione Supabase ─────────────────────────────────────────────
  useEffect(() => {
    // Carica sessione esistente
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) scheduleProfileEnsure(data.session);
      setSessionReady(true);
    });

    // Ascolta cambi di stato auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (!s) {
        // Logout — svuota cache preferiti
        queryClient.removeQueries({ queryKey: ["preferiti"] });
        return;
      }
      if (event === "SIGNED_IN") {
        scheduleProfileEnsure(s);
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // ── User derivato dalla sessione ────────────────────────────────────
  const profileId = session?.user?.id ?? null;
  const user: User | null = session?.user
    ? {
        name:
          session.user.user_metadata?.full_name ??
          session.user.user_metadata?.name ??
          session.user.email?.split("@")[0] ??
          "Atleta",
        email: session.user.email ?? "",
      }
    : null;

  // ── Preferiti da Supabase ────────────────────────────────────────────
  const { data: dbFavs } = useQuery<FavoriteRow[]>({
    queryKey: QUERY_KEYS.preferiti(profileId),
    queryFn: () => fetchFavorites(profileId!),
    enabled: !!profileId,
    staleTime: 30_000,
  });

  const favCampoIds: string[] = useMemo(
    () => (dbFavs ?? []).map((f) => String(f.fk_campo)),
    [dbFavs]
  );

  // ── Azioni ──────────────────────────────────────────────────────────

  const completeOnboarding = useCallback((prefs?: UserPrefs) => {
    setPersisted((s) => ({ ...s, onboarded: true, prefs: prefs ?? s.prefs }));
  }, []);

  const setPrefs = useCallback((patch: Partial<UserPrefs>) => {
    setPersisted((s) => ({ ...s, prefs: { ...s.prefs, ...patch } }));
  }, []);

  const register = useCallback(
    async (input: RegisterInput): Promise<AuthResult> => {
      return signUp(input);
      // session update comes via onAuthStateChange
    },
    []
  );

  const login = useCallback(async (input: LoginInput): Promise<AuthResult> => {
    return signIn(input);
    // session update comes via onAuthStateChange
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<OAuthResult> => {
    return signInWithGoogle();
    // session update comes via onAuthStateChange
  }, []);

  const logout = useCallback(() => {
    signOut(); // fire-and-forget; onAuthStateChange svuota la sessione
    void clearPersisted();
  }, []);

  const togglePreferitoCampo = useCallback(
    async (campoId: string) => {
      if (!profileId) return; // il chiamante deve reindirizzare al login
      const campoIdNum = Number(campoId);
      const isFav = (dbFavs ?? []).some((f) => f.fk_campo === campoIdNum);
      const key = QUERY_KEYS.preferiti(profileId);

      // Aggiornamento ottimistico
      const prev = queryClient.getQueryData<FavoriteRow[]>(key) ?? [];
      queryClient.setQueryData<FavoriteRow[]>(
        key,
        isFav
          ? prev.filter((f) => f.fk_campo !== campoIdNum)
          : [
              ...prev,
              {
                fk_campo: campoIdNum,
                fk_profilo: profileId,
                created_at: new Date().toISOString(),
                aggiornato_il: new Date().toISOString(),
              },
            ]
      );

      try {
        if (isFav) {
          await removeFavorite(profileId, campoIdNum);
        } else {
          await addFavorite(profileId, campoIdNum);
        }
      } catch (err) {
        console.error("[togglePreferitoCampo] Supabase error:", err);
        queryClient.setQueryData(key, prev); // ripristino
      } finally {
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
    [profileId, dbFavs, queryClient]
  );

  const isPreferitoCampo = useCallback(
    (id: string) => {
      const campoIdNum = Number(id);
      return (dbFavs ?? []).some((f) => f.fk_campo === campoIdNum);
    },
    [dbFavs]
  );

  const setFiltri = useCallback((filtri: Filtri) => {
    setPersisted((s) => ({ ...s, filters: conConteggioAttivo(filtri) }));
  }, []);

  const resetFiltri = useCallback(() => {
    setPersisted((s) => ({ ...s, filters: DEFAULT_FILTERS }));
  }, []);

  // ── Preferiti (solo campi) ───────────────────────────────────────────
  const preferiti: Preferiti = useMemo(
    () => ({ campoIds: favCampoIds }),
    [favCampoIds]
  );

  const value = useMemo<AppStateValue>(
    () => ({
      ready,
      user,
      profileId,
      onboarded: persisted.onboarded,
      prefs: persisted.prefs,
      preferiti,
      filtri: persisted.filters,
      completeOnboarding,
      setPrefs,
      register,
      login,
      loginWithGoogle,
      logout,
      togglePreferitoCampo,
      isPreferitoCampo,
      setFiltri,
      resetFiltri,
    }),
    [
      ready,
      user,
      profileId,
      persisted.onboarded,
      persisted.prefs,
      persisted.filters,
      preferiti,
      completeOnboarding,
      setPrefs,
      register,
      login,
      loginWithGoogle,
      logout,
      togglePreferitoCampo,
      isPreferitoCampo,
      setFiltri,
      resetFiltri,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

/* ------------------------------------------------------------------ *
 * Hook                                                                *
 * ------------------------------------------------------------------ */

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx)
    throw new Error("useAppState deve essere usato dentro <AppStateProvider>");
  return ctx;
}
