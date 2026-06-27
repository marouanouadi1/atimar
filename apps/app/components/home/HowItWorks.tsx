import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { theme } from "@/theme/tokens";
import { Icon } from "@/ui";

const STEPS = [
  {
    n: 1,
    icon: "tennisball-outline" as const,
    title: "Scegli lo sport",
    desc: "Seleziona il tuo sport preferito tra padel, tennis, calcio e altro ancora.",
  },
  {
    n: 2,
    icon: "search-outline" as const,
    title: "Trova il campo",
    desc: "Filtra per zona, prezzo, disponibilità e servizi. Trova la struttura perfetta.",
  },
  {
    n: 3,
    icon: "checkmark-circle-outline" as const,
    title: "Scegli e gioca",
    desc: "Apri la scheda della struttura, confronta i campi e trova quella giusta.",
  },
];

/** 3-step explainer section for the web homepage. */
export function HowItWorks() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= theme.breakpoints.tablet;

  return (
    // Outer section: full-width surface background
    <View style={styles.section}>
      {/* Inner: content centering on desktop */}
      <View style={[styles.inner, isDesktop && styles.innerDesktop]}>
        <View style={[styles.header, isDesktop && styles.headerDesktop]}>
          <Text style={styles.eyebrow}>COME FUNZIONA</Text>
          <Text style={[styles.heading, isDesktop && styles.headingDesktop]}>
            Tre passi verso il prossimo match
          </Text>
        </View>

        <View style={[styles.steps, isDesktop && styles.stepsDesktop]}>
          {STEPS.map((step) => (
            <View key={step.n} style={[styles.step, isDesktop && styles.stepDesktop]}>
              <View style={styles.stepTop}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumText}>{step.n}</Text>
                </View>
                <View style={styles.stepIcon}>
                  <Icon name={step.icon} size={22} color={theme.colors.primary} />
                </View>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Full-width surface background — never add maxWidth here. */
  section: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.xxxl,
  },
  /** Content centering container. */
  inner: {
    paddingHorizontal: theme.spacing.xxl,
    gap: theme.spacing.xxxl,
  },
  innerDesktop: {
    maxWidth: theme.layout.maxContent,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: theme.layout.screenPadDesktop,
    paddingVertical: 40,
    gap: 56,
  },
  header: {
    gap: theme.spacing.md,
  },
  headerDesktop: {
    maxWidth: 560,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.displayBold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  heading: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.displayBold,
    fontSize: 26,
    letterSpacing: -0.78,
    lineHeight: 34,
  },
  headingDesktop: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -1.2,
  },
  steps: {
    gap: theme.spacing.xxl,
  },
  stepsDesktop: {
    flexDirection: "row",
    gap: theme.spacing.xxxl,
  },
  step: {
    gap: theme.spacing.md,
  },
  stepDesktop: {
    flex: 1,
  },
  stepTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.displayBold,
    fontSize: 16,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.tints.blueTint,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 17,
    letterSpacing: -0.34,
  },
  stepDesc: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
  },
});
