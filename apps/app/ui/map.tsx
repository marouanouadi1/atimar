import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Circle, Marker } from "react-native-maps";
import type { Region } from "react-native-maps";
import { theme } from "@/theme/tokens";
import type { GeoPoint } from "@atimar/types";
import { textStyle } from "./theme";
import {
  buildMapPins,
  radiusKmForViewport,
  selectedMapPin,
  type MapPreviewProps,
} from "./map-shared";

const DEFAULT_REGION: Region = {
  latitude: 41.9028,
  longitude: 12.4964,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

// Tempo massimo (ms) entro cui un animateToRegion programmatico deve produrre
// un onRegionChangeComplete: oltre, il flag si auto-resetta per non
// "ingoiare" un gesto utente successivo se l'animazione viene interrotta.
const PROGRAMMATIC_MOVE_TIMEOUT = 1000;

function regionForPoints(points: GeoPoint[]): Region {
  if (points.length === 0) return DEFAULT_REGION;

  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;
  const latitudeDelta = Math.max(0.035, (maxLat - minLat) * 1.6);
  const longitudeDelta = Math.max(0.035, (maxLng - minLng) * 1.6);

  return { latitude, longitude, latitudeDelta, longitudeDelta };
}

/** Regione che inquadra un cerchio di raggio `radiusKm` intorno a `center`. */
function regionForRadius(center: GeoPoint, radiusKm: number): Region {
  const latDelta = Math.max(0.035, (radiusKm * 2 * 1.3) / 111);
  const cos = Math.cos((center.lat * Math.PI) / 180);
  const lngDelta = Math.max(
    0.035,
    (radiusKm * 2 * 1.3) / (111 * (cos || 1)),
  );
  return {
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
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
  const mapRef = useRef<MapView | null>(null);
  const h = height ?? (compact ? 140 : 320);
  const origin = searchOrigin ?? userLocation ?? null;
  const pins = useMemo(() => buildMapPins(campi, selectedId), [campi, selectedId]);
  const points = useMemo(
    () => [
      ...pins.map((pin) => pin.position),
      ...(userLocation ? [userLocation] : []),
    ],
    [pins, userLocation],
  );
  // initialRegion è "uncontrolled" per react-native-maps: usata solo al mount.
  const initialRegion = useMemo(
    () =>
      searchOrigin && radius
        ? regionForRadius(searchOrigin, radius)
        : regionForPoints(points),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const activePin = selectedMapPin(pins, selectedId);

  // Flag "movimento programmatico": true finché non arriva il primo
  // onRegionChangeComplete successivo a un animateToRegion innescato dal
  // codice (selezione pin, nuova ricerca per zona). Parte true per ignorare
  // il completamento della regione iniziale al mount.
  const programmatic = useRef(true);
  const programmaticTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markProgrammatic = useCallback(() => {
    programmatic.current = true;
    if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
    programmaticTimer.current = setTimeout(() => {
      programmatic.current = false;
    }, PROGRAMMATIC_MOVE_TIMEOUT);
  }, []);
  useEffect(
    () => () => {
      if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!activePin) return;
    markProgrammatic();
    mapRef.current?.animateToRegion(
      {
        latitude: activePin.position.lat,
        longitude: activePin.position.lng,
        latitudeDelta: 0.035,
        longitudeDelta: 0.035,
      },
      260,
    );
  }, [activePin, markProgrammatic]);

  const searchOriginKey = searchOrigin
    ? `${searchOrigin.lat.toFixed(4)},${searchOrigin.lng.toFixed(4)}`
    : null;
  // Chiave dell'ultimo (centro, raggio) comunicato a onSearchArea dalla mappa
  // stessa: se searchOrigin/radius cambiano per rispecchiare esattamente
  // quel valore (perché è stata la mappa a chiederlo spostandosi), il fit
  // sotto va saltato — la mappa è già inquadrata così, rifittarla
  // produrrebbe uno "scatto" indietro subito dopo il gesto dell'utente.
  const lastEmittedKey = useRef<string | null>(null);

  useEffect(() => {
    if (activePin) return;
    if (!searchOrigin || !radius) return;
    if (lastEmittedKey.current === `${searchOriginKey},${radius}`) return;
    markProgrammatic();
    mapRef.current?.animateToRegion(regionForRadius(searchOrigin, radius), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOriginKey, radius]);

  const handleRegionChangeComplete = (region: Region) => {
    if (programmatic.current) {
      programmatic.current = false;
      if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
      return;
    }
    if (!onSearchArea) return;
    const center: GeoPoint = {
      lat: Number(region.latitude.toFixed(4)),
      lng: Number(region.longitude.toFixed(4)),
    };
    const radiusKm = radiusKmForViewport(
      region.latitudeDelta,
      region.longitudeDelta,
      region.latitude,
    );
    lastEmittedKey.current = `${center.lat.toFixed(4)},${center.lng.toFixed(4)},${radiusKm}`;
    onSearchArea(center, radiusKm);
  };

  // Scatta SOLO durante un trascinamento avviato dall'utente (mai per
  // animateToRegion programmatico). Se l'utente afferra la mappa mentre è in
  // corso un fit programmatico, la posizione finale del gesto è comunque
  // sua: invalidiamo subito il flag così l'onRegionChangeComplete risultante
  // non viene inghiottito da un fit concomitante.
  const handlePanDrag = () => {
    programmatic.current = false;
    if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
  };

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
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        rotateEnabled={false}
        pitchEnabled={false}
        onPanDrag={handlePanDrag}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {origin && radius ? (
          <Circle
            center={{
              latitude: origin.lat,
              longitude: origin.lng,
            }}
            radius={radius * 1000}
            strokeColor="rgba(49, 92, 255, 0.38)"
            fillColor="rgba(49, 92, 255, 0.10)"
          />
        ) : null}

        {userLocation ? (
          <Marker
            coordinate={{
              latitude: userLocation.lat,
              longitude: userLocation.lng,
            }}
            title="La tua posizione"
            zIndex={10}
          >
            <View style={styles.userPinOuter}>
              <View style={styles.userPinInner} />
            </View>
          </Marker>
        ) : null}

        {pins.map((pin) => {
          const active = pin.campi.some((campo) => campo.id === selectedId);
          const color = active ? theme.mapMarker.pinActive : theme.mapMarker.pin;
          const head = active ? 34 : 26;
          const dot = active ? 12 : 9;
          const tail = active ? 14 : 11;
          return (
            <Marker
              key={pin.id}
              coordinate={{
                latitude: pin.position.lat,
                longitude: pin.position.lng,
              }}
              anchor={{ x: 0.5, y: 1 }}
              zIndex={active ? 20 : 1}
              onPress={() => onSelect?.(pin.selectedCampoId)}
            >
              <View style={styles.pinWrap}>
                <View
                  style={[
                    styles.pinHead,
                    {
                      width: head,
                      height: head,
                      borderRadius: head / 2,
                      backgroundColor: color,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.pinDot,
                      { width: dot, height: dot, borderRadius: dot / 2 },
                    ]}
                  />
                </View>
                <View
                  style={[
                    styles.pinTail,
                    {
                      borderLeftWidth: tail / 2,
                      borderRightWidth: tail / 2,
                      borderTopWidth: tail,
                      borderTopColor: color,
                    },
                  ]}
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

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
  pinWrap: {
    alignItems: "center",
  },
  pinHead: {
    borderWidth: 3,
    borderColor: theme.mapMarker.ring,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.floatBtn,
  },
  pinDot: {
    backgroundColor: theme.mapMarker.ring,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -3,
  },
  userPinOuter: {
    width: 26,
    height: 26,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(49, 92, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  userPinInner: {
    width: 14,
    height: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    borderWidth: 3,
    borderColor: theme.colors.surface,
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
