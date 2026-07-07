import { View, useWindowDimensions } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { theme } from "@/theme/tokens";

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ResponsiveContainer({
  children,
  maxWidth = theme.layout.maxContent,
  padded = true,
  style,
}: ResponsiveContainerProps) {
  const { width } = useWindowDimensions();
  const desktop = width >= theme.breakpoints.desktop;

  return (
    <View
      style={[
        {
          width: "100%",
          maxWidth,
          alignSelf: "center",
          boxSizing: "border-box",
          paddingHorizontal: padded
            ? desktop
              ? theme.layout.screenPadDesktop
              : theme.layout.screenPadX
            : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
