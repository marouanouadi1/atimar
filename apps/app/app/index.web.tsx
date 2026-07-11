import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { theme } from "@/theme/tokens";
import { useAppState } from "@/state/AppState";
import { WebHeader } from "@/components/layout/WebHeader";
import { WebFooter } from "@/components/layout/WebFooter";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchCockpit } from "@/components/home/SearchCockpit";
import { NearbyFieldsSection } from "@/components/home/NearbyFieldsSection";
import { SportCategoryGrid } from "@/components/home/SportCategoryGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { GestoriCta } from "@/components/home/GestoriCta";

export default function WebHomepage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, ready, onboarded, onboardedResolved } = useAppState();

  // After Google OAuth redirect, the user lands here. Once the session is
  // detected (detectSessionInUrl: true in client.ts), redirect to the app —
  // through setup first if the account hasn't completed onboarding yet.
  // Skip the native marketing intro on web, same as (tabs)/_layout.tsx.
  // Guard on pathname === "/" so deep links to /favorites etc. are not overridden
  // when this component stays mounted as the stack anchor.
  useEffect(() => {
    if (ready && user && onboardedResolved && pathname === "/") {
      router.replace(onboarded ? "/home" : "/setup/sports");
    }
  }, [ready, user, onboarded, onboardedResolved, pathname, router]);

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <WebHeader />

      {/* Full-width dark hero */}
      <View style={styles.heroWrap}>
        <HeroSection />
      </View>

      {/* Floating search cockpit overlapping the hero */}
      <SearchCockpit />

      {/* Nearby fields horizontal scroll */}
      <NearbyFieldsSection />

      {/* Sport category tiles */}
      <SportCategoryGrid />

      {/* How it works */}
      <HowItWorks />

      {/* CTA gestori (sezione scura) */}
      <GestoriCta />

      <WebFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    gap: 0,
  },
  heroWrap: {
    overflow: "hidden",
  },
});
