/**
 * MapPreview + MapPin — an isolated graphic placeholder (no Google/Mapbox).
 * Same API a real map would expose (courts/selectedId/onSelect/radius), so it
 * can be swapped later without touching screens. Colors from @/theme/tokens.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { sportColor, theme } from "@/theme/tokens";
import type { CourtListItem } from "@atimar/types";
import { textStyle } from "./theme";

/* ------------------------------------------------------------------ *
 * MapPin
 * ------------------------------------------------------------------ */

interface MapPinProps {
  label: string;
  sportId: string;
  selected?: boolean;
  onPress?: () => void;
}

function MapPin({ label, sportId, selected = false, onPress }: MapPinProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && { opacity: 0.8 }]}
    >
      {selected ? <View style={styles.pinHalo} /> : null}
      <View
        style={[styles.pin, selected ? styles.pinSelected : styles.pinIdle]}
      >
        <View
          style={[styles.pinDot, { backgroundColor: sportColor(sportId) }]}
        />
        <Text style={textStyle("micro", "ink")}>{label}</Text>
      </View>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * MapPreview
 * ------------------------------------------------------------------ */

export interface MapPreviewProps {
  courts: CourtListItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** Show a radius ring (setup area step); 1..50 → relative size. */
  radius?: number;
  compact?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function MapPreview({
  courts,
  selectedId,
  onSelect,
  radius,
  compact = false,
  height,
  style,
}: MapPreviewProps) {
  const h = height ?? (compact ? 140 : 320);
  // radius 1..50 mapped to 30%..95% of the frame.
  const ringPct =
    radius != null ? Math.min(0.3 + (radius / 50) * 0.65, 0.95) : 0;

  return (
    <View style={[styles.map, { height: h }, style]}>
      {/* decorative "terrain" blobs */}
      <View style={[styles.blob, styles.blobA]} />
      <View style={[styles.blob, styles.blobB]} />

      {radius != null ? (
        <View style={styles.center}>
          <View
            style={[
              styles.ring,
              { width: `${ringPct * 100}%`, aspectRatio: 1 },
            ]}
          />
          <View style={styles.meDot} />
        </View>
      ) : null}

      {courts.map((c) => (
        <View
          key={c.id}
          style={[
            styles.pinWrap,
            { left: `${c.map.x * 100}%`, top: `${c.map.y * 100}%` },
          ]}
        >
          <MapPin
            label={c.price}
            sportId={c.sportId}
            selected={c.id === selectedId}
            onPress={onSelect ? () => onSelect(c.id) : undefined}
          />
        </View>
      ))}
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
  blob: {
    position: "absolute",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.placeholder,
    opacity: 0.6,
  },
  blobA: {
    width: "60%",
    height: "50%",
    top: "-10%",
    left: "-15%",
  },
  blobB: {
    width: "55%",
    height: "45%",
    bottom: "-12%",
    right: "-12%",
  },
  center: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    borderRadius: theme.radius.pill,
    borderWidth: 2,
    borderColor: theme.colors.lime,
    backgroundColor: theme.tints.limeTint,
  },
  meDot: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
  pinWrap: {
    position: "absolute",
    transform: [{ translateX: -24 }, { translateY: -16 }],
  },
  pin: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    ...theme.shadows.floatBtn,
  },
  pinIdle: {
    backgroundColor: theme.colors.surface,
  },
  pinSelected: {
    backgroundColor: theme.colors.lime,
  },
  pinDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.pill,
  },
  pinHalo: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.tints.limeTint,
    alignSelf: "center",
    top: -10,
  },
});
