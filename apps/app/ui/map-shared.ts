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
  style?: StyleProp<ViewStyle>;
  userLocation?: GeoPoint | null;
  locationStatus?: UserLocationStatus;
  onRequestLocation?: () => void | Promise<void>;
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
