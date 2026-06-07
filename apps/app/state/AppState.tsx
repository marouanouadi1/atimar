/**
 * Global app state — court-first, persisted to AsyncStorage.
 *
 * Mirrors the prototype's single localStorage-backed store, adapted to React
 * Context. The shape is mock-friendly but stable: swapping the data layer for
 * Supabase later only changes how `prefs`/`bookings` are seeded/synced, not the
 * screens that consume `useAppState()`.
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
import {
  DEFAULT_FAVORITES,
  DEFAULT_FILTERS,
  DEFAULT_PREFS,
} from "@atimar/data";
import { withActiveCount } from "@atimar/utils";
import type {
  Booking,
  Favorites,
  Filters,
  User,
  UserPrefs,
} from "@atimar/types";
import { clearPersisted, loadPersisted, savePersisted } from "./storage";
import type { LoginInput, RegisterInput } from "./auth";
import { validateLogin, validateRegister } from "./auth";
import type { AuthResult } from "./auth";

/* ------------------------------------------------------------------ *
 * Persisted shape
 * ------------------------------------------------------------------ */

interface PersistedState {
  onboarded: boolean;
  user: User | null;
  prefs: UserPrefs;
  favorites: Favorites;
  filters: Filters;
  bookings: Booking[];
}

const INITIAL: PersistedState = {
  onboarded: false,
  user: null,
  prefs: DEFAULT_PREFS,
  favorites: DEFAULT_FAVORITES,
  filters: DEFAULT_FILTERS,
  bookings: [],
};

/* ------------------------------------------------------------------ *
 * Context value
 * ------------------------------------------------------------------ */

interface AppStateValue extends PersistedState {
  /** False until the persisted state has hydrated (gate the splash on this). */
  ready: boolean;
  completeOnboarding: (prefs?: UserPrefs) => void;
  setPrefs: (patch: Partial<UserPrefs>) => void;
  register: (input: RegisterInput) => AuthResult;
  login: (input: LoginInput) => AuthResult;
  logout: () => void;
  toggleFavCourt: (courtId: string) => void;
  toggleFavVenue: (venueId: string) => void;
  isFavCourt: (courtId: string) => boolean;
  isFavVenue: (venueId: string) => boolean;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  addBooking: (booking: Booking) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

/* ------------------------------------------------------------------ *
 * Provider
 * ------------------------------------------------------------------ */

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(INITIAL);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  // Hydrate once on mount.
  useEffect(() => {
    let active = true;
    loadPersisted<Partial<PersistedState>>().then((saved) => {
      if (!active) return;
      if (saved) setState((prev) => ({ ...prev, ...saved }));
      hydrated.current = true;
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // Persist after hydration on every change.
  useEffect(() => {
    if (!hydrated.current) return;
    void savePersisted(state);
  }, [state]);

  const completeOnboarding = useCallback((prefs?: UserPrefs) => {
    setState((s) => ({ ...s, onboarded: true, prefs: prefs ?? s.prefs }));
  }, []);

  const setPrefs = useCallback((patch: Partial<UserPrefs>) => {
    setState((s) => ({ ...s, prefs: { ...s.prefs, ...patch } }));
  }, []);

  const register = useCallback((input: RegisterInput): AuthResult => {
    const result = validateRegister(input);
    if (result.ok && result.user) {
      setState((s) => ({ ...s, user: result.user! }));
    }
    return result;
  }, []);

  const login = useCallback((input: LoginInput): AuthResult => {
    const result = validateLogin(input);
    if (result.ok && result.user) {
      setState((s) => ({ ...s, user: result.user! }));
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, user: null }));
    void clearPersisted();
  }, []);

  const toggleFavCourt = useCallback((courtId: string) => {
    setState((s) => {
      const has = s.favorites.courtIds.includes(courtId);
      const courtIds = has
        ? s.favorites.courtIds.filter((id) => id !== courtId)
        : [...s.favorites.courtIds, courtId];
      return { ...s, favorites: { ...s.favorites, courtIds } };
    });
  }, []);

  const toggleFavVenue = useCallback((venueId: string) => {
    setState((s) => {
      const has = s.favorites.venueIds.includes(venueId);
      const venueIds = has
        ? s.favorites.venueIds.filter((id) => id !== venueId)
        : [...s.favorites.venueIds, venueId];
      return { ...s, favorites: { ...s.favorites, venueIds } };
    });
  }, []);

  const setFilters = useCallback((filters: Filters) => {
    setState((s) => ({ ...s, filters: withActiveCount(filters) }));
  }, []);

  const resetFilters = useCallback(() => {
    setState((s) => ({ ...s, filters: DEFAULT_FILTERS }));
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setState((s) => ({ ...s, bookings: [booking, ...s.bookings] }));
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      ...state,
      ready,
      completeOnboarding,
      setPrefs,
      register,
      login,
      logout,
      toggleFavCourt,
      toggleFavVenue,
      isFavCourt: (id) => state.favorites.courtIds.includes(id),
      isFavVenue: (id) => state.favorites.venueIds.includes(id),
      setFilters,
      resetFilters,
      addBooking,
    }),
    [
      state,
      ready,
      completeOnboarding,
      setPrefs,
      register,
      login,
      logout,
      toggleFavCourt,
      toggleFavVenue,
      setFilters,
      resetFilters,
      addBooking,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

/* ------------------------------------------------------------------ *
 * Hook
 * ------------------------------------------------------------------ */

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx)
    throw new Error("useAppState must be used within <AppStateProvider>");
  return ctx;
}
