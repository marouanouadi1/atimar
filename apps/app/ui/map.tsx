/**
 * MapPreview — placeholder "Mappa in arrivo".
 * Accetta la stessa API che una mappa reale userebbe (campi/selectedId/onSelect/radius)
 * così quando integreremo la mappa reale le schermate non cambieranno.
 * TODO: sostituire con Google Maps / Mapbox quando disponibile.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { theme } from "@/theme/tokens";
import type { CampoInLista } from "@atimar/types";
import { textStyle } from "./theme";

/* ------------------------------------------------------------------ *
 * MapPreview
 * ------------------------------------------------------------------ */

export interface MapPreviewProps {
  campi: CampoInLista[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** Mostra un anello raggio (step setup area); 1..50 → dimensione relativa. */
  radius?: number;
  compact?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function MapPreview({
  compact = false,
  height,
  style,
}: MapPreviewProps) {
  const h = height ?? (compact ? 140 : 320);

  return (
    <View style={[styles.map, { height: h }, style]}>
      {/* blob decorativi per simulare il terreno */}
      <View style={[styles.blob, styles.blobA]} />
      <View style={[styles.blob, styles.blobB]} />

      {/* Placeholder centrale */}
      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Text style={styles.mapEmoji}>🗺️</Text>
        </View>
        <Text style={textStyle("bodyStrong", "muted")}>Mappa in arrivo</Text>
        <Text style={textStyle("caption", "muted")}>
          La visualizzazione sulla mappa sarà disponibile presto
        </Text>
      </View>
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
    opacity: 0.4,
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
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xl,
  },
  iconWrap: {
    marginBottom: theme.spacing.xs,
  },
  mapEmoji: {
    fontSize: 36,
  },
});
