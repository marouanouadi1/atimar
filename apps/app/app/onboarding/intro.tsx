import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { theme } from "@/theme/tokens";
import {
  Button,
  Icon,
  ScreenContainer,
  StepProgress,
  sportMeta,
  textStyle,
} from "@/ui";

const BENEFITS = [
  {
    icon: "options-outline" as const,
    title: "Match personalizzati",
    desc: "Campi e orari adatti ai tuoi sport e al tuo livello.",
    color: theme.colors.primary,
  },
  {
    icon: "bulb-outline" as const,
    title: "Suggerimenti migliori",
    desc: "Scopri le strutture più vicine e meglio recensite.",
    color: theme.colors.lime,
  },
  {
    icon: "time-outline" as const,
    title: "Risparmia tempo",
    desc: "Richiedi disponibilità in pochi tocchi, senza chiamate.",
    color: theme.colors.orange,
  },
];

const HERO_SPORTS = ["padel", "calcio", "basket", "tennis"].map((id) => {
  const m = sportMeta(id);
  return { icon: m.icon, bg: m.color, fg: "surface" as const };
});

export default function SetupIntro() {
  const router = useRouter();

  const webGrad =
    process.env.EXPO_OS === "web"
      ? ({
          backgroundImage:
            "radial-gradient(circle at 78% 18%, rgba(217,255,67,.20), transparent 30%), linear-gradient(145deg, #12140F 0%, #20251A 100%)",
        } as object)
      : {};

  return (
    <ScreenContainer
      safeTop={false}
      header={null}
      footer={
        <View style={styles.footer}>
          <StepProgress step={3} total={3} variant="dots" />
          <Button icon onPress={() => router.push("/setup/sports")}>
            Iniziamo
          </Button>
        </View>
      }
    >
      {/* Hero */}
      <View style={[styles.hero, webGrad]}>
        <View style={styles.heroTop}>
          <View style={styles.heroBackBtn}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={styles.backButton}
            >
              <Icon name="chevron-back" size={20} color="surface" />
            </Pressable>
          </View>
          <Pressable
            onPress={() => router.push("/setup/sports")}
            hitSlop={8}
            style={styles.skipBtn}
          >
            <Text style={styles.skipText}>Salta</Text>
          </Pressable>
        </View>

        <View style={styles.heroIcons}>
          {HERO_SPORTS.map((s, i) => (
            <View
              key={i}
              style={[
                styles.iconBubble,
                { backgroundColor: s.bg, marginTop: i % 2 === 1 ? -12 : 0 },
              ]}
            >
              <Icon name={s.icon} size={28} color={s.fg} />
            </View>
          ))}
        </View>

        <View style={styles.heroText}>
          <Text style={styles.heroHeadline}>
            Personalizza{"\n"}
            <Text style={styles.heroLime}>ATIMAR</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Bastano pochi passaggi per ricevere consigli su misura per te.
          </Text>
        </View>
      </View>

      {/* Benefits */}
      <View style={styles.benefits}>
        {BENEFITS.map((b) => (
          <View key={b.title} style={styles.benefit}>
            <View style={[styles.benefitIcon, { backgroundColor: b.color + "18" }]}>
              <Icon name={b.icon} size={20} color={b.color} />
            </View>
            <View style={styles.benefitText}>
              <Text style={textStyle("bodyStrong", "ink")}>{b.title}</Text>
              <Text style={textStyle("caption", "muted")}>{b.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: theme.colors.ink,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.xl,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.layout.screenPadX,
    paddingTop: theme.layout.headerTopOnboard,
    width: "100%",
    maxWidth: theme.layout.maxReading,
    alignSelf: "center",
  },
  heroBackBtn: {},
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  skipText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    fontWeight: "500",
  },
  heroIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxl,
    width: "100%",
    maxWidth: theme.layout.maxReading,
    alignSelf: "center",
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: {
    paddingHorizontal: theme.spacing.xxl,
    gap: theme.spacing.sm,
    width: "100%",
    maxWidth: theme.layout.maxReading,
    alignSelf: "center",
  },
  heroHeadline: {
    color: theme.colors.surface,
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 44,
  },
  heroLime: {
    color: theme.colors.lime,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    lineHeight: 24,
  },
  benefits: {
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.lg,
    width: "100%",
    maxWidth: theme.layout.maxReading,
    alignSelf: "center",
  },
  benefit: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  benefitText: {
    flex: 1,
    gap: 2,
  },
  footer: {
    gap: theme.spacing.md,
    alignItems: "center",
  },
});
