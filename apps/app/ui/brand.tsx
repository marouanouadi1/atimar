import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { theme } from "@/theme/tokens";

export interface BrandMarkProps {
  size?: number;
  inverse?: boolean;
  wordmark?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function BrandMark({
  size = 42,
  inverse = false,
  wordmark = true,
  style,
}: BrandMarkProps) {
  const dark = inverse ? theme.colors.surface : theme.colors.ink;
  const light = inverse ? theme.colors.ink : theme.colors.surface;

  return (
    <View style={[styles.row, style]}>
      <View
        style={[
          styles.mark,
          {
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.24),
            backgroundColor: dark,
          },
        ]}
      >
        <View
          style={[
            styles.court,
            {
              inset: Math.round(size * 0.2),
              borderColor: light,
              borderRadius: Math.round(size * 0.08),
            },
          ]}
        >
          <View style={[styles.centerLine, { backgroundColor: light }]} />
          <View style={[styles.serviceLine, { backgroundColor: light }]} />
        </View>
        <View
          style={[
            styles.voltCut,
            {
              width: Math.round(size * 0.16),
              height: Math.round(size * 0.5),
              backgroundColor: theme.colors.lime,
              transform: [{ rotate: "28deg" }],
            },
          ]}
        />
      </View>
      {wordmark ? (
        <Text
          style={[
            styles.wordmark,
            {
              color: dark,
              fontSize: Math.max(20, Math.round(size * 0.58)),
              lineHeight: Math.max(24, Math.round(size * 0.64)),
            },
          ]}
        >
          ATIMAR
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  mark: {
    overflow: "hidden",
  },
  court: {
    position: "absolute",
    borderWidth: 1.5,
  },
  centerLine: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 1.5,
  },
  serviceLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 1.5,
  },
  voltCut: {
    position: "absolute",
    right: "18%",
    top: "-8%",
  },
  wordmark: {
    fontFamily: theme.fonts.displayBold,
    letterSpacing: -1,
  },
});
