/**
 * Thin JSON wrapper over the community AsyncStorage package.
 * NOTE: the legacy `AsyncStorage` from react-native core is removed — the
 * supported package is `@react-native-async-storage/async-storage` (already a
 * dependency). On web it transparently uses localStorage via react-native-web.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "atimar-app";

export async function loadPersisted<T>(): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function savePersisted<T>(value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Persistence is best-effort; a failed write must never crash the UI.
  }
}

export async function clearPersisted(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
