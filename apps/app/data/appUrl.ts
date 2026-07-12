import { Platform } from "react-native";
import Constants from "expo-constants";

const sanitize = (url: string) => url.replace(/\/+$/, "");

/**
 * URL pubblico dell'app per i link condivisibili (invito, condivisione struttura).
 * Sempre DERIVATO, nessuna configurazione da mantenere:
 * - Web: window.location.origin (dominio corrente, anche preview/PR).
 * - Native dev: host del bundler Metro (funziona anche su device fisico).
 * Il native in produzione verra' gestito quando si lavorera' sull'app nativa.
 */
export function getAppUrl(): string {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return sanitize(window.location.origin);
  }

  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    return hostUri ? `http://${hostUri}` : "http://localhost:8081";
  }

  // TODO(native-prod): URL pubblico dell'app nativa in produzione.
  return "";
}
