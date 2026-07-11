import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { theme } from "@/theme/tokens";
import { Icon, isWeb, useHover, webElev, webTransition } from "@/ui";

const STEPS = [
  {
    n: 1,
    icon: "tennisball-outline" as const,
    title: "Scegli lo sport",
    desc: "Parti da padel, tennis, calcio e altri sport disponibili nella tua zona.",
  },
  {
    n: 2,
    icon: "search-outline" as const,
    title: "Trova il campo",
    desc: "Filtra per zona, prezzo, distanza e servizi davvero utili prima del match.",
  },
  {
    n: 3,
    icon: "checkmark-circle-outline" as const,
    title: "Scegli e gioca",
    desc: "Apri la scheda, confronta i dettagli e arriva alla struttura giusta.",
  },
];

function StepCard({
  n,
  icon,
  title,
  desc,
  isDesktop,
}: (typeof STEPS)[number] & { isDesktop: boolean }) {
  const { hovered, hoverProps } = useHover();
  return (
    <View
      {...hoverProps}
      style={[
        styles.step,
        isDesktop && styles.stepDesktop,
        isWeb && styles.stepElev,
        webTransition("transform, box-shadow", 200),
        hovered && styles.stepHover,
      ]}
    >
      <View style={[styles.accent, hovered && styles.accentHover]} />
      <View style={styles.stepTop}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumText}>{n}</Text>
        </View>
        <View style={styles.stepIcon}>
          <Icon name={icon} size={22} color={theme.colors.primary} />
        </View>
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDesc}>{desc}</Text>
    </View>
  );
}

/** 3-step explainer section for the web homepage. */
export function HowItWorks() {
  const { width } = useWindowDimensions();
  // Soglia mobile↔desktop unica (1024) coerente con le altre sezioni homepage.
  const isDesktop = width >= theme.breakpoints.desktop;

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
            <StepCard key={step.n} {...step} isDesktop={isDesktop} />
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
    gap: theme.spacing.xl,
  },
  step: {
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    overflow: "hidden",
  },
  stepElev: {
    boxShadow: webElev.rest,
  },
  stepHover: {
    transform: [{ translateY: -6 }],
    boxShadow: webElev.hover,
  },
  stepDesktop: {
    flex: 1,
  },
  // Top accent bar that lights up on hover.
  accent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: theme.colors.line,
  },
  accentHover: {
    backgroundColor: theme.colors.lime,
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
