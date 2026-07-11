import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/theme/tokens";
import { Icon, bgFloodlitPanel, useHover, webTransition } from "@/ui";

const FEATURES = [
  { icon: "megaphone-outline" as const, label: "Una vetrina chiara per la tua struttura" },
  { icon: "grid-outline" as const, label: "Campi, sport e servizi sempre visibili" },
  { icon: "location-outline" as const, label: "Più facile farti trovare dagli sportivi vicini" },
];

/** Sezione CTA scura per i gestori di strutture sportive — usata nell'homepage web. */
export function GestoriCta() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  // Soglia mobile↔desktop unica (1024) coerente con le altre sezioni homepage.
  const isDesktop = width >= theme.breakpoints.desktop;
  const cta = useHover();

  return (
    // Sezione esterna: sfondo ink a piena larghezza — non aggiungere mai maxWidth qui
    <View style={[styles.section, isDesktop && styles.sectionDesktop, bgFloodlitPanel]}>
      {/* Interno: centratura del contenuto (mobile: 24px pad; desktop: maxWidth + 40px) */}
      <View style={[styles.inner, isDesktop && styles.innerDesktop]}>
        <View style={styles.content}>
          <View style={styles.badge}>
            <Icon name="business-outline" size={14} color={theme.colors.lime} />
            <Text style={styles.badgeText}>PER LE STRUTTURE</Text>
          </View>

          <Text style={[styles.heading, isDesktop && styles.headingDesktop]}>
            Dai più visibilità{"\n"}alla tua struttura
          </Text>
          <Text style={styles.subheading}>
            Crea una presenza chiara per campi, sport e servizi, proprio dove
            gli atleti stanno già cercando il prossimo posto in cui giocare.
          </Text>

          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f.label} style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Icon name={f.icon} size={16} color={theme.colors.lime} />
                </View>
                <Text style={styles.featureText}>{f.label}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => router.push("/gestori" as never)}
            {...cta.hoverProps}
            style={({ pressed }) => [
              styles.cta,
              webTransition("transform, box-shadow", 200),
              cta.hovered && styles.ctaHover,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.ctaText}>Registra la tua struttura</Text>
            <Icon name="arrow-forward" size={18} color={theme.colors.ink} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: theme.colors.ink,
    paddingVertical: theme.spacing.xxxl,
  },
  sectionDesktop: {
    paddingVertical: 88,
  },
  inner: {
    // mobile: semplice padding orizzontale
    paddingHorizontal: theme.spacing.xxl,
  },
  innerDesktop: {
    // desktop: centrato dentro maxContent
    maxWidth: theme.layout.maxContent,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: theme.layout.screenPadDesktop,
  },
  content: {
    gap: theme.spacing.xl,
    maxWidth: 680,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.lime,
    fontFamily: theme.fonts.displayBold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  heading: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.displayBold,
    fontSize: 28,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  headingDesktop: {
    fontSize: 40,
    lineHeight: 50,
    letterSpacing: -1.2,
  },
  subheading: {
    color: theme.overlays.subtleOnDark,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 26,
  },
  features: {
    gap: theme.spacing.md,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.tints.limeTintSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    color: theme.overlays.dimOnDark,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    flex: 1,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    alignSelf: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.lime,
    borderRadius: theme.radius.pill,
    marginTop: theme.spacing.sm,
  },
  ctaHover: {
    transform: [{ translateY: -2 }],
    boxShadow: "0 16px 34px rgba(147,185,0,0.45)",
  },
  ctaText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
  },
});
