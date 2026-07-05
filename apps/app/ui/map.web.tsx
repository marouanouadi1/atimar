import "leaflet/dist/leaflet.css";

import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import L from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { theme, sportColor } from "@/theme/tokens";
import type { GeoPoint } from "@atimar/types";
import {
  buildMapPins,
  selectedMapPin,
  type MapPreviewProps,
} from "./map-shared";
import { textStyle } from "./theme";

const DEFAULT_CENTER: [number, number] = [41.9028, 12.4964];

function markerIcon(color: string, active: boolean): L.DivIcon {
  const size = active ? 38 : 30;
  const dot = active ? 14 : 12;
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width:${size}px;
      height:${size}px;
      border-radius:999px;
      background:#FFFEF7;
      border:${active ? 4 : 3}px solid ${color};
      box-shadow:0 8px 20px rgba(18,20,15,0.14);
      display:flex;
      align-items:center;
      justify-content:center;
      box-sizing:border-box;
    "><div style="
      width:${dot}px;
      height:${dot}px;
      border-radius:999px;
      background:${color};
    "></div></div>`,
  });
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
}: {
  points: GeoPoint[];
  activePin: ReturnType<typeof selectedMapPin>;
}) {
  const map = useMap();

  useEffect(() => {
    if (activePin) {
      map.flyTo([activePin.position.lat, activePin.position.lng], 14, {
        duration: 0.35,
      });
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
  }, [activePin, map, points]);

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
  const h = height ?? (compact ? 140 : 320);
  const pins = useMemo(() => buildMapPins(campi, selectedId), [campi, selectedId]);
  const points = useMemo(
    () => [
      ...pins.map((pin) => pin.position),
      ...(userLocation ? [userLocation] : []),
    ],
    [pins, userLocation],
  );
  const activePin = selectedMapPin(pins, selectedId);

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
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={5}
        scrollWheelZoom={!compact}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport points={points} activePin={activePin} />

        {userLocation && radius ? (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
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
          const color = sportColor(pin.sportId);
          return (
            <Marker
              key={pin.id}
              position={[pin.position.lat, pin.position.lng]}
              icon={markerIcon(color, active)}
              eventHandlers={{
                click: () => onSelect?.(pin.selectedCampoId),
              }}
            >
              <Tooltip>
                {pin.campi[0].nomeStruttura} · {pin.campi.length}{" "}
                {pin.campi.length === 1 ? "campo" : "campi"}
              </Tooltip>
            </Marker>
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
