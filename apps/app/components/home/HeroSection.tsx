import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { theme } from "@/theme/tokens";
import { BrandMark, Icon, MediaStruttura } from "@/ui";
import { useStrutture } from "@/data/hooks";
import { useAppState } from "@/state/AppState";

const SPORTS = [
  { id: "all", label: "Tutti" },
  { id: "padel", label: "Padel" },
  { id: "tennis", label: "Tennis" },
  { id: "calcio5", label: "Calcio 5" },
  { id: "beachvolley", label: "Beach Volley" },
] as const;

interface Props {
  onSportSelect?: (sportId: string) => void;
}

export function HeroSection({ onSportSelect }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data: strutture = [] } = useStrutture();
  const { filtri, setFiltri } = useAppState();
  const desktop = width >= theme.breakpoints.desktop;
  const featured = strutture.find((s) => s.urlFotoCopertina) ?? strutture[0];

  const selectSport = (id: string) => {
    onSportSelect?.(id);
    setFiltri({ ...filtri, sport: id });
    router.push("/search");
  };

  return (
    <View style={styles.section}>
      <View
        style={[
          styles.inner,
          {
            width: Math.min(
              width -
                (desktop
                  ? theme.layout.screenPadDesktop * 2
                  : theme.layout.screenPadX * 2),
              theme.layout.maxContent,
            ),
          },
          desktop && styles.innerDesktop,
        ]}
      >
        <View style={styles.copy}>
          <BrandMark inverse size={42} style={styles.mobileBrand} />
          <View style={styles.eyebrow}>
            <View style={styles.eyebrowLine} />
            <Text style={styles.eyebrowText}>SPORT, SENZA GIRI A VUOTO</Text>
          </View>
          <Text style={[styles.headline, desktop && styles.headlineDesktop]}>
            Trova il campo.{"\n"}
            <Text style={styles.headlineAccent}>Prenditi la città.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Strutture vere, dettagli chiari e la strada più breve tra la voglia
            di giocare e il prossimo match.
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {SPORTS.map((sport) => (
              <Pressable
                key={sport.id}
                onPress={() => selectSport(sport.id)}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{sport.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.actions}>
            <Pressable onPress={() => router.push("/search")} style={styles.primaryCta}>
              <Text style={styles.primaryCtaText}>Esplora i campi</Text>
              <Icon name="arrow-forward" size={18} color="ink" />
            </Pressable>
            <Pressable
              onPress={() => router.push("/gestori" as never)}
              style={styles.secondaryCta}
            >
              <Text style={styles.secondaryCtaText}>Sei una struttura?</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.visual}>
          <MediaStruttura
            photoUrl={featured?.urlFotoCopertina}
            sportId={featured?.idSport[0]}
            height={desktop ? 560 : 340}
            style={styles.photo}
          >
            <View style={styles.photoBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.photoBadgeText}>
                {featured?.nome ?? "Campi selezionati da Atimar"}
              </Text>
            </View>
          </MediaStruttura>
          <View style={styles.visualTag}>
            <Text style={styles.visualTagTop}>PLAY</Text>
            <Text style={styles.visualTagBottom}>LOCAL</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: theme.colors.ink,
    overflow: "hidden",
  },
  inner: {
    maxWidth: theme.layout.maxContent,
    alignSelf: "center",
    boxSizing: "border-box",
    paddingTop: theme.spacing.xxxl,
    paddingBottom: 88,
    gap: theme.spacing.xxxl,
  },
  innerDesktop: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 76,
    paddingBottom: 112,
    gap: 64,
  },
  copy: {
    flex: 0.92,
    gap: theme.spacing.xl,
  },
  mobileBrand: {
    display: "none",
  },
  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  eyebrowLine: {
    width: 32,
    height: 3,
    backgroundColor: theme.colors.lime,
  },
  eyebrowText: {
    color: theme.colors.lime,
    fontFamily: theme.fonts.displayBold,
    fontSize: 12,
    letterSpacing: 1.7,
  },
  headline: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.displayBold,
    fontSize: 44,
    lineHeight: 46,
    letterSpacing: -1.6,
  },
  headlineDesktop: {
    fontSize: 70,
    lineHeight: 70,
    letterSpacing: -3,
  },
  headlineAccent: {
    color: theme.colors.lime,
  },
  subtitle: {
    color: theme.overlays.subtleOnDark,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 17,
    lineHeight: 27,
    maxWidth: 600,
  },
  chips: {
    gap: theme.spacing.sm,
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.overlays.chipOnDark,
  },
  chipText: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  primaryCta: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lime,
  },
  primaryCtaText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
  },
  secondaryCta: {
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  secondaryCtaText: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 15,
    textDecorationLine: "underline",
  },
  visual: {
    flex: 1.08,
  },
  photo: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.overlays.borderOnDark,
  },
  photoBadge: {
    position: "absolute",
    left: theme.spacing.lg,
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.overlays.photoBadgeBg,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.lime,
  },
  photoBadgeText: {
    flex: 1,
    color: theme.colors.surface,
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 13,
  },
  visualTag: {
    position: "absolute",
    top: -20,
    right: -12,
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    transform: [{ rotate: "9deg" }],
  },
  visualTagTop: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.displayBold,
    fontSize: 12,
    letterSpacing: 2,
  },
  visualTagBottom: {
    color: theme.colors.lime,
    fontFamily: theme.fonts.displayBold,
    fontSize: 18,
    letterSpacing: -0.5,
  },
});
