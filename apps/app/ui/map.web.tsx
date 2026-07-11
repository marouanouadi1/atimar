import "leaflet/dist/leaflet.css";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import L from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { theme } from "@/theme/tokens";
import type { GeoPoint } from "@atimar/types";
import {
  buildMapPins,
  radiusKmForViewport,
  selectedMapPin,
  type MapPreviewProps,
} from "./map-shared";
import { textStyle } from "./theme";

const DEFAULT_CENTER: [number, number] = [41.9028, 12.4964];
// Tempo massimo (ms) entro cui un movimento programmatico deve produrre un
// moveend: oltre, il flag si auto-resetta per non "ingoiare" un gesto utente
// successivo se l'animazione viene interrotta a metà (es. da map.stop()).
const PROGRAMMATIC_MOVE_TIMEOUT = 1000;

const iconCache = new Map<string, L.DivIcon>();

/** Pin a goccia stile Google Maps: un solo colore, più grande/scuro se attivo. */
function markerIcon(active: boolean): L.DivIcon {
  const key = active ? "active" : "idle";
  const cached = iconCache.get(key);
  if (cached) return cached;

  const w = active ? 36 : 28;
  const h = Math.round(w * (34 / 24));
  const color = active ? theme.mapMarker.pinActive : theme.mapMarker.pin;
  const icon = L.divIcon({
    className: "",
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    html: `<svg width="${w}" height="${h}" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 6px 10px rgba(18,20,15,0.28));">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 22 12 22s12-13 12-22c0-6.6-5.4-12-12-12z" fill="${color}"/>
      <circle cx="12" cy="12" r="5" fill="${theme.mapMarker.ring}"/>
    </svg>`,
  });
  iconCache.set(key, icon);
  return icon;
}

const userIcon = L.divIcon({
  className: "",
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  html: `<div style="
    width:26px;
    height:26px;
    border-radius:999px;
    background:rgba(49,92,255,0.18);
    display:flex;
    align-items:center;
    justify-content:center;
  "><div style="
    width:14px;
    height:14px;
    border-radius:999px;
    background:#315CFF;
    border:3px solid #FFFEF7;
    box-sizing:border-box;
  "></div></div>`,
});

function MapViewport({
  points,
  activePin,
  searchOrigin,
  radius,
  onUserMove,
}: {
  points: GeoPoint[];
  activePin: ReturnType<typeof selectedMapPin>;
  searchOrigin?: GeoPoint | null;
  radius?: number;
  onUserMove?: (center: GeoPoint, radiusKm: number) => void;
}) {
  const map = useMap();
  const programmatic = useRef(false);
  const programmaticTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Chiave dell'ultimo (centro, raggio) comunicato a onUserMove dalla mappa
  // stessa: se searchOrigin/radius cambiano per rispecchiare esattamente
  // quel valore (perché è stata la mappa a chiederlo spostandosi), il fit
  // sotto va saltato — la mappa è già inquadrata così, rifittarla
  // produrrebbe uno "scatto" indietro subito dopo il gesto dell'utente.
  const lastEmittedKey = useRef<string | null>(null);

  const markProgrammatic = useCallback(() => {
    programmatic.current = true;
    if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
    programmaticTimer.current = setTimeout(() => {
      programmatic.current = false;
    }, PROGRAMMATIC_MOVE_TIMEOUT);
  }, []);

  const pointsKey = useMemo(
    () =>
      points
        .map((point) => `${point.lat.toFixed(5)},${point.lng.toFixed(5)}`)
        .sort()
        .join("|"),
    [points],
  );
  const searchOriginKey = searchOrigin
    ? `${searchOrigin.lat.toFixed(4)},${searchOrigin.lng.toFixed(4)}`
    : null;

  // Annulla lo zoom-con-rotellina in coda e il timer del flag "programmatico"
  // quando la mappa viene smontata: Leaflet non fa clearTimeout in
  // removeHooks, quindi un _performZoom schedulato girerebbe dopo
  // map.remove() → crash "_leaflet_pos".
  useEffect(
    () => () => {
      if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
      try {
        clearTimeout(
          (map.scrollWheelZoom as unknown as { _timer?: number })?._timer,
        );
      } catch {
        /* handler assente o già rimosso: no-op */
      }
    },
    [map],
  );

  // Fit al set di punti (o al cerchio di ricerca, se presente) solo su cambi
  // materiali (primo load / cambio filtri / nuova ricerca per zona), non sul
  // churn di riferimenti da refetch → preserva lo zoom dell'utente. Se il
  // nuovo searchOrigin/radius coincide con l'ultimo emesso da onUserMove, la
  // mappa è già inquadrata così (è stata lei a chiederlo spostandosi): il fit
  // andrebbe saltato per non "scattare" indietro subito dopo il gesto.
  useEffect(() => {
    if (activePin) return;
    if (!map.getContainer()) return;
    if (
      searchOrigin &&
      radius &&
      lastEmittedKey.current === `${searchOriginKey},${radius}`
    ) {
      return;
    }

    try {
      map.stop();
      markProgrammatic();

      if (searchOrigin && radius) {
        const bounds = L.latLng(searchOrigin.lat, searchOrigin.lng).toBounds(
          radius * 2 * 1000,
        );
        map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
        return;
      }
      if (points.length === 0) {
        map.setView(DEFAULT_CENTER, 5);
        return;
      }
      if (points.length === 1) {
        map.setView([points[0].lat, points[0].lng], 13);
        return;
      }
      const bounds = L.latLngBounds(
        points.map((point) => [point.lat, point.lng] as [number, number]),
      );
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 });
    } catch {
      /* mappa in via di smontaggio: no-op */
    }
    // activePin/points volutamente esclusi: rifit solo su pointsKey/searchOrigin/radius
    // per non resettare lo zoom su deselezione o refetch a dati invariati.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, pointsKey, searchOriginKey, radius]);

  // Fly alla selezione quando cambia il pin attivo.
  useEffect(() => {
    if (!activePin) return;
    if (!map.getContainer()) return;

    try {
      map.stop();
      markProgrammatic();
      map.flyTo([activePin.position.lat, activePin.position.lng], 14, {
        duration: 0.35,
      });
    } catch {
      /* mappa in via di smontaggio: no-op */
    }
  }, [map, activePin, markProgrammatic]);

  // Movimenti manuali (pan/zoom dell'utente) → ricarica i dati per l'area
  // ora visibile (centro + raggio che copre il viewport). I movimenti
  // innescati dal codice (fit/flyTo sopra) sono marcati e vengono ignorati qui.
  useMapEvents({
    // "dragstart" scatta SOLO per un trascinamento avviato dall'utente (mai
    // per fitBounds/flyTo programmatici). Se l'utente afferra la mappa mentre
    // un fit programmatico è ancora in corso, la posizione finale del gesto è
    // comunque sua: invalidiamo subito il flag così il moveend risultante non
    // viene inghiottito da un fit concomitante (es. innescato dalla chiusura
    // della card, che può spostare leggermente il pin "primario" del venue).
    dragstart: () => {
      programmatic.current = false;
      if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
    },
    moveend: () => {
      if (programmatic.current) {
        programmatic.current = false;
        if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
        return;
      }
      if (!onUserMove) return;
      const center = map.getCenter();
      const bounds = map.getBounds();
      const geoCenter: GeoPoint = {
        lat: Number(center.lat.toFixed(4)),
        lng: Number(center.lng.toFixed(4)),
      };
      const radiusKm = radiusKmForViewport(
        bounds.getNorth() - bounds.getSouth(),
        bounds.getEast() - bounds.getWest(),
        center.lat,
      );
      lastEmittedKey.current = `${geoCenter.lat.toFixed(4)},${geoCenter.lng.toFixed(4)},${radiusKm}`;
      onUserMove(geoCenter, radiusKm);
    },
  });

  return null;
}

function LocationControl({
  status = "idle",
  onRequestLocation,
}: {
  status?: MapPreviewProps["locationStatus"];
  onRequestLocation?: () => void | Promise<void>;
}) {
  if (!onRequestLocation || status === "granted") return null;

  const loading = status === "loading";
  const label =
    status === "denied"
      ? "Posizione negata"
      : status === "unavailable"
        ? "Posizione non disponibile"
        : status === "error"
          ? "Riprova posizione"
          : "Usa posizione";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={loading}
      onPress={() => void onRequestLocation()}
      style={({ pressed }) => [
        styles.locationControl,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <>
          <Ionicons name="locate" size={14} color={theme.colors.primary} />
          <Text style={textStyle("caption", "primary")}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function MapPreview({
  campi,
  selectedId,
  onSelect,
  radius,
  compact = false,
  height,
  fill = false,
  style,
  userLocation,
  locationStatus,
  onRequestLocation,
  searchOrigin,
  onSearchArea,
}: MapPreviewProps) {
  const h = height ?? (compact ? 140 : 320);
  const { width: windowWidth } = useWindowDimensions();
  // Sui telefoni i controlli +/- di Leaflet occupano spazio prezioso e sono
  // ridondanti col pinch-to-zoom: li mostriamo solo da tablet in su.
  const showZoomControl = windowWidth >= theme.breakpoints.tablet;
  const origin = searchOrigin ?? userLocation ?? null;
  const pins = useMemo(() => buildMapPins(campi, selectedId), [campi, selectedId]);
  const points = useMemo(
    () => [
      ...pins.map((pin) => pin.position),
      ...(userLocation ? [userLocation] : []),
    ],
    [pins, userLocation],
  );
  const activePin = useMemo(
    () => selectedMapPin(pins, selectedId),
    [pins, selectedId],
  );

  if (pins.length === 0 && !userLocation && !searchOrigin) {
    return (
      <View
        style={[
          fill ? styles.emptyMapFill : [styles.emptyMap, { height: h }],
          style,
        ]}
      >
        <Text style={textStyle("bodyStrong", "muted")}>Nessun punto mappa</Text>
        <Text style={[textStyle("caption", "muted"), styles.emptyText]}>
          I campi caricati non hanno coordinate disponibili.
        </Text>
      </View>
    );
  }

  return (
    <View style={[fill ? styles.mapFill : [styles.map, { height: h }], style]}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={5}
        scrollWheelZoom={!compact}
        zoomControl={showZoomControl}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport
          points={points}
          activePin={activePin}
          searchOrigin={searchOrigin ?? undefined}
          radius={radius}
          onUserMove={onSearchArea}
        />

        {origin && radius ? (
          <Circle
            center={[origin.lat, origin.lng]}
            radius={radius * 1000}
            pathOptions={{
              color: "rgba(49, 92, 255, 0.38)",
              fillColor: "rgba(49, 92, 255, 0.10)",
              fillOpacity: 1,
              weight: 2,
            }}
          />
        ) : null}

        {userLocation ? (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Tooltip>La tua posizione</Tooltip>
          </Marker>
        ) : null}

        {pins.map((pin) => {
          const active = pin.campi.some((campo) => campo.id === selectedId);
          return (
            <Marker
              key={pin.id}
              position={[pin.position.lat, pin.position.lng]}
              icon={markerIcon(active)}
              zIndexOffset={active ? 1000 : 0}
              eventHandlers={{
                click: () => onSelect?.(pin.selectedCampoId),
              }}
            />
          );
        })}
      </MapContainer>

      <LocationControl
        status={locationStatus}
        onRequestLocation={onRequestLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    borderRadius: theme.radius.hero,
    backgroundColor: theme.colors.chip,
    borderWidth: 1,
    borderColor: theme.colors.line,
    overflow: "hidden",
  },
  mapFill: {
    flex: 1,
    backgroundColor: theme.colors.chip,
    overflow: "hidden",
  },
  emptyMap: {
    borderRadius: theme.radius.hero,
    backgroundColor: theme.colors.chip,
    borderWidth: 1,
    borderColor: theme.colors.line,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyMapFill: {
    flex: 1,
    backgroundColor: theme.colors.chip,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    textAlign: "center",
  },
  locationControl: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    minHeight: 36,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.overlays.glass,
    borderWidth: 1,
    borderColor: theme.overlays.glassLine,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    zIndex: 1000,
    ...theme.shadows.floatBtn,
  },
  pressed: {
    opacity: 0.82,
  },
});
