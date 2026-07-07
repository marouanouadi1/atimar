import React, { useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import type { Region } from "react-native-maps";
import { theme, sportColor } from "@/theme/tokens";
import type { GeoPoint } from "@atimar/types";
import { textStyle } from "./theme";
import {
  buildMapPins,
  selectedMapPin,
  type MapPreviewProps,
} from "./map-shared";

const DEFAULT_REGION: Region = {
  latitude: 41.9028,
  longitude: 12.4964,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

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
        <Text style={textStyle("caption", "primary")}>{label}</Text>
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
  style,
  userLocation,
  locationStatus,
  onRequestLocation,
}: MapPreviewProps) {
  const mapRef = useRef<MapView | null>(null);
  const h = height ?? (compact ? 140 : 320);
  const pins = useMemo(() => buildMapPins(campi, selectedId), [campi, selectedId]);
  const points = useMemo(
    () => [
      ...pins.map((pin) => pin.position),
      ...(userLocation ? [userLocation] : []),
    ],
    [pins, userLocation],
  );
  const initialRegion = useMemo(() => regionForPoints(points), [points]);
  const activePin = selectedMapPin(pins, selectedId);

  useEffect(() => {
    if (!activePin) return;
    mapRef.current?.animateToRegion(
      {
        latitude: activePin.position.lat,
        longitude: activePin.position.lng,
        latitudeDelta: 0.035,
        longitudeDelta: 0.035,
      },
      260,
    );
  }, [activePin]);

  if (pins.length === 0 && !userLocation) {
    return (
      <View style={[styles.emptyMap, { height: h }, style]}>
        <Text style={textStyle("bodyStrong", "muted")}>Nessun punto mappa</Text>
        <Text style={[textStyle("caption", "muted"), styles.emptyText]}>
          I campi caricati non hanno coordinate disponibili.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.map, { height: h }, style]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {userLocation && radius ? (
          <Circle
            center={{
              latitude: userLocation.lat,
              longitude: userLocation.lng,
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
          const color = sportColor(pin.sportId);
          const active = pin.campi.some((campo) => campo.id === selectedId);
          return (
            <Marker
              key={pin.id}
              coordinate={{
                latitude: pin.position.lat,
                longitude: pin.position.lng,
              }}
              title={pin.campi[0].nomeStruttura}
              description={`${pin.campi.length} ${
                pin.campi.length === 1 ? "campo" : "campi"
              }`}
              zIndex={active ? 5 : 1}
              onPress={() => onSelect?.(pin.selectedCampoId)}
            >
              <View
                style={[
                  styles.pin,
                  active && styles.pinActive,
                  { borderColor: color },
                ]}
              >
                <View style={[styles.pinDot, { backgroundColor: color }]} />
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
  emptyText: {
    textAlign: "center",
  },
  pin: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.floatBtn,
  },
  pinActive: {
    width: 38,
    height: 38,
    borderWidth: 4,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: theme.radius.pill,
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
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.floatBtn,
  },
  pressed: {
    opacity: 0.82,
  },
});
