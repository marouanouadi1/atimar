import { useState } from "react";
import { StyleSheet, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { Image } from "expo-image";

import { sportColor, theme } from "@/theme/tokens";
import { Icon } from "./primitives";

export interface MediaStrutturaProps {
  photoUrl?: string | null;
  sportId?: string;
  height?: number;
  rounded?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function MediaStruttura({
  photoUrl,
  sportId = "padel",
  height = theme.layout.cardHeroHeight,
  rounded = true,
  children,
  style,
}: MediaStrutturaProps) {
  const [failed, setFailed] = useState(false);
  const [prevPhotoUrl, setPrevPhotoUrl] = useState(photoUrl);

  if (prevPhotoUrl !== photoUrl) {
    setPrevPhotoUrl(photoUrl);
    setFailed(false);
  }

  return (
    <View
      style={[
        styles.root,
        {
          height,
          borderRadius: rounded ? theme.radius.card : 0,
        },
        style,
      ]}
    >
      {photoUrl && !failed ? (
        <Image
          source={{ uri: photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={220}
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.fallback]}>
          <View
            style={[
              styles.glow,
              { backgroundColor: `${sportColor(sportId)}55` },
            ]}
          />
          <View style={styles.court}>
            <View style={styles.verticalLine} />
            <View style={styles.horizontalLine} />
          </View>
          <Icon
            name={sportId.startsWith("calcio") ? "football" : "tennisball"}
            size={46}
            color={theme.colors.lime}
          />
        </View>
      )}
      {photoUrl && !failed ? <View style={styles.scrim} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.ink,
    overflow: "hidden",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.ink,
  },
  glow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.45,
    transform: [{ translateX: 72 }, { translateY: -42 }],
  },
  court: {
    position: "absolute",
    inset: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    borderRadius: theme.radius.md,
  },
  verticalLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 1,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  horizontalLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  scrim: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: theme.overlays.scrimSoft,
  },
});
