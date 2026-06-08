import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { Logo } from "@/ui";
import { useAppState } from "@/state/AppState";

/**
 * Splash + navigation gate. Holds the splash until persisted state hydrates,
 * then redirects: onboarding → auth → app. (Real route is `/` so it loads first.)
 */
export default function Splash() {
  const { ready, onboarded, user } = useAppState();

  if (!ready) return <SplashView />;
  if (!onboarded) return <Redirect href="/onboarding/value-near" />;
  if (!user) return <Redirect href="/auth/login" />;
  return <Redirect href="/home" />;
}

function SplashView() {
  return (
    <View style={styles.root}>
      <Logo scale={1.4} />
      <Text style={styles.tagline}>
        Trova il campo giusto, gioca quando vuoi.
      </Text>
      <ActivityIndicator color={theme.colors.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.bg,
  },
  tagline: {
    color: theme.colors.muted,
    fontSize: theme.typography.body.fontSize,
    textAlign: "center",
  },
  spinner: {
    marginTop: theme.spacing.lg,
  },
});
