import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

import { AppStateProvider } from "@/state/AppState";

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppStateProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="setup" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="venue/[id]" />
            <Stack.Screen
              name="booking/request"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="booking/confirm"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen name="filters" options={{ presentation: "modal" }} />
          </Stack>
          <StatusBar style="dark" />
        </AppStateProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
