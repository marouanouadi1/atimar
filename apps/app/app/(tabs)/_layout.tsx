import { Redirect, Tabs } from "expo-router";
import React, { type ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/theme/tokens";
import { Icon, textStyle } from "@/ui";
import { WebHeader } from "@/components/layout/WebHeader";
import { useAppState } from "@/state/AppState";

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

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];

function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  // On desktop web, WebHeader handles navigation
  if (process.env.EXPO_OS === "web") return null;

  return (
    <View
      style={[styles.bar, { paddingBottom: insets.bottom + theme.spacing.sm }]}
    >
      {state.routes.map((route, index) => {
        const def = TABS[route.name];
        if (!def) return null;
        const focused = state.index === index;
        const onPress = () => {
          if (process.env.EXPO_OS === "ios") {
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
            <View style={[styles.iconPill, focused && styles.iconPillActive]}>
              <Icon
                name={focused ? def.active : def.inactive}
                size={theme.iconSizes.lg}
                color={focused ? "ink" : "subtle"}
              />
            </View>
            <Text style={textStyle("small", focused ? "ink" : "subtle")}>
              {def.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { ready, user, onboarded, onboardedResolved } = useAppState();

  // Un utente autenticato ma non onboarded (es. web: registrazione avvenuta
  // prima dell'onboarding) viene spinto nel wizard prima di vedere le tab.
  if (ready && user && !onboardedResolved) return null;
  if (ready && user && !onboarded) return <Redirect href="/onboarding/value-near" />;

  return (
    <View style={styles.root}>
      <WebHeader />
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="favorites" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  bar: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.line,
    paddingTop: theme.spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  iconPill: {
    width: 56,
    height: 30,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPillActive: {
    backgroundColor: theme.colors.lime,
  },
});
