import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { theme } from "@/theme/tokens";
import AMark from "@/assets/brand/logo-mark.svg";

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
        <AMark width={size * 0.7} height={size * 0.7} fill={light} />
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
          <Text style={{ color: theme.colors.lime }}>·</Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    fontFamily: theme.fonts.displayBold,
    letterSpacing: -1,
  },
});
