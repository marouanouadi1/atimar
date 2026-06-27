import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/theme/tokens";
import { Icon } from "@/ui";

const FEATURES = [
  { icon: "megaphone-outline" as const, label: "Una vetrina chiara per la tua struttura" },
  { icon: "grid-outline" as const, label: "Campi, sport e servizi sempre visibili" },
  { icon: "location-outline" as const, label: "Più facile da trovare nella tua zona" },
];

/** Sezione CTA scura per i gestori di strutture sportive — usata nell'homepage web. */
export function GestoriCta() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= theme.breakpoints.tablet;

  const webGradient =
    process.env.EXPO_OS === "web"
      ? ({
          backgroundImage:
            "radial-gradient(circle at 82% 20%, rgba(49,92,255,.38), transparent 28%), linear-gradient(145deg, #12140F 0%, #20251A 100%)",
        } as object)
      : {};

  return (
    // Sezione esterna: sfondo ink a piena larghezza — non aggiungere mai maxWidth qui
    <View style={[styles.section, isDesktop && styles.sectionDesktop, webGradient]}>
      {/* Interno: centratura del contenuto (mobile: 24px pad; desktop: maxWidth + 40px) */}
      <View style={[styles.inner, isDesktop && styles.innerDesktop]}>
        <View style={styles.content}>
          <View style={styles.badge}>
            <Icon name="business-outline" size={14} color={theme.colors.lime} />
            <Text style={styles.badgeText}>PER LE STRUTTURE</Text>
          </View>

          <Text style={[styles.heading, isDesktop && styles.headingDesktop]}>
            Porta la tua struttura{"\n"}su ATIMAR
          </Text>
          <Text style={styles.subheading}>
            Presenta campi, sport e servizi agli atleti che stanno cercando dove giocare.
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
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
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
    maxWidth: 600,
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
  ctaText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
  },
});
