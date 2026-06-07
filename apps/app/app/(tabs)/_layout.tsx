import { Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/theme/tokens";
import { Icon, textStyle } from "@/ui";

interface TabDef {
  label: string;
  active: string;
  inactive: string;
}

const TABS: Record<string, TabDef> = {
  home: { label: "Home", active: "home", inactive: "home-outline" },
  search: { label: "Cerca", active: "search", inactive: "search-outline" },
  favorites: { label: "Preferiti", active: "heart", inactive: "heart-outline" },
  profile: { label: "Profilo", active: "person", inactive: "person-outline" },
};

function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[styles.bar, { paddingBottom: insets.bottom + theme.spacing.sm }]}
    >
      {state.routes.map((route, index) => {
        const def = TABS[route.name];
        if (!def) return null;
        const focused = state.index === index;
        const onPress = () => {
          if (Platform.OS !== "web") {
            void Haptics.selectionAsync();
          }
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.item}
            accessibilityRole="button"
          >
            <Icon
              name={focused ? def.active : def.inactive}
              size={theme.iconSizes.lg}
              color={focused ? "primary" : "subtle"}
            />
            <Text style={textStyle("small", focused ? "primary" : "subtle")}>
              {def.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: theme.overlays.glass,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.line,
    paddingTop: theme.spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
});
