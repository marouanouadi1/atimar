import type { StyleProp, ViewStyle } from "react-native";
import type { CampoInLista, GeoPoint } from "@atimar/types";
import type { UserLocationStatus } from "@/data/use-user-location";

export interface MapPreviewProps {
  campi: CampoInLista[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** Mostra un anello raggio quando la posizione utente e' disponibile. */
  radius?: number;
  compact?: boolean;
  height?: number;
  /** Riempie il contenitore in flex (mappa immersiva a tutto schermo) invece di usare `height`. */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
  userLocation?: GeoPoint | null;
  locationStatus?: UserLocationStatus;
  onRequestLocation?: () => void | Promise<void>;
  /** Punto attorno a cui si cerca (default: userLocation). Centra cerchio raggio e fit iniziale. */
  searchOrigin?: GeoPoint | null;
  /**
   * Chiamata quando l'utente sposta o zooma la mappa: passa il centro
   * corrente e il raggio (km) che copre l'area visibile. Sostituisce un
   * raggio impostato manualmente — la ricerca segue sempre quello che è
   * inquadrato in mappa.
   */
  onSearchArea?: (center: GeoPoint, radiusKm: number) => void;
}

function hasValidPosition(campo: CampoInLista): boolean {
  return (
    Number.isFinite(campo.posizione.lat) &&
    Number.isFinite(campo.posizione.lng)
  );
}

export function buildMapPins(campi: CampoInLista[], selectedId?: string) {
  const byVenue = new Map<string, CampoInLista[]>();

  for (const campo of campi) {
    if (!hasValidPosition(campo)) continue;
    const current = byVenue.get(campo.strutturaId) ?? [];
    current.push(campo);
    byVenue.set(campo.strutturaId, current);
  }

  return Array.from(byVenue.entries()).map(([id, group]) => {
    const selected = group.find((campo) => campo.id === selectedId);
    const primary = selected ?? group[0];
    return {
      id,
      campi: group,
      selectedCampoId: primary.id,
      position: primary.posizione,
      sportId: primary.idSport,
    };
  });
}

/**
 * Raggio (km) che circoscrive l'intera area visibile della mappa (mezza
 * diagonale del rettangolo del viewport), così il cerchio di ricerca copre
 * anche gli angoli dello schermo. Usato per derivare la ricerca dallo
 * zoom/pan della mappa invece che da un raggio impostato manualmente.
 */
export function radiusKmForViewport(
  latSpanDeg: number,
  lngSpanDeg: number,
  centerLat: number,
): number {
  const latKm = (latSpanDeg * 111) / 2;
  const cos = Math.cos((centerLat * Math.PI) / 180) || 1;
  const lngKm = (lngSpanDeg * 111 * cos) / 2;
  return Math.max(1, Math.round(Math.sqrt(latKm * latKm + lngKm * lngKm)));
}

export function selectedMapPin(
  pins: ReturnType<typeof buildMapPins>,
  selectedId?: string,
) {
  if (!selectedId) return null;
  return (
    pins.find((pin) => pin.campi.some((campo) => campo.id === selectedId)) ??
    null
  );
}
