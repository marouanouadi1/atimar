import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

const ROUTES = [
  {
    title: "Onboarding",
    description:
      "Flusso iniziale per mostrare valore, sport preferiti e setup utente.",
    href: "/onboarding/value-near",
  },
  {
    title: "Login demo",
    description: "Schermata di accesso mock per entrare nell’applicazione.",
    href: "/auth/login",
  },
  {
    title: "Esplora campi",
    description: "Home app con campi, strutture, ricerca e preferiti.",
    href: "/home",
  },
  {
    title: "Ricerca",
    description: "Vista ricerca con filtri e lista risultati.",
    href: "/search",
  },
] as const;

export default function WebDemoLanding() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>ATIMAR demo</Text>
        <Text style={styles.title}>Bozza web dell’app Expo universale</Text>
        <Text style={styles.subtitle}>
          Questa pagina esiste solo su web per rendere visibile subito la demo.
          Su mobile l’app continua a usare il gate onboarding/login.
        </Text>
        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/onboarding/value-near")}
          >
            <Text style={styles.primaryButtonText}>Inizia onboarding</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/home")}
          >
            <Text style={styles.secondaryButtonText}>Vai alla home demo</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.grid}>
        {ROUTES.map((item) => (
          <Pressable
            key={item.href}
            style={styles.card}
            onPress={() => router.push(item.href)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardLink}>Apri →</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: "100%",
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing.xxxl,
    paddingVertical: 56,
    gap: theme.spacing.xxxl,
  },
  hero: {
    width: "100%",
    maxWidth: 920,
    alignSelf: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 40,
    gap: theme.spacing.lg,
    ...theme.shadows.pop,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: theme.typography.overline.fontSize,
    fontWeight: theme.typography.overline.fontWeight,
    letterSpacing: theme.typography.overline.letterSpacing,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.ink,
    fontSize: 44,
    lineHeight: 52,
    fontWeight: "800",
    letterSpacing: -1.2,
    maxWidth: 760,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 18,
    lineHeight: 28,
    maxWidth: 720,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontWeight: "700",
    fontSize: theme.typography.body.fontSize,
  },
  secondaryButton: {
    backgroundColor: theme.colors.chip,
    borderRadius: theme.radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
  secondaryButtonText: {
    color: theme.colors.ink,
    fontWeight: "700",
    fontSize: theme.typography.body.fontSize,
  },
  grid: {
    width: "100%",
    maxWidth: 920,
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.lg,
  },
  card: {
    flexBasis: 280,
    flexGrow: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: theme.spacing.xxl,
    gap: theme.spacing.sm,
  },
  cardTitle: {
    color: theme.colors.ink,
    fontSize: theme.typography.sectionHead.fontSize,
    lineHeight: theme.typography.sectionHead.lineHeight,
    fontWeight: theme.typography.sectionHead.fontWeight,
  },
  cardDescription: {
    color: theme.colors.muted,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
  },
  cardLink: {
    color: theme.colors.primary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    marginTop: theme.spacing.sm,
  },
});
