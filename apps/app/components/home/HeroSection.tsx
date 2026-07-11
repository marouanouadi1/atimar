import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useMemo } from "react";
import { useRouter } from "expo-router";

import { formatRating } from "@atimar/utils";
import { theme } from "@/theme/tokens";
import {
  BrandMark,
  Icon,
  MediaStruttura,
  bgFloodlitHero,
  useEntrance,
  useHover,
  webElev,
  webTransition,
} from "@/ui";
import { useStrutture } from "@/data/hooks";

export function HeroSection() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data: strutture = [] } = useStrutture();
  const desktop = width >= theme.breakpoints.desktop;
  // La struttura in copertina è quella con più consensi reali (voto medio,
  // poi numero recensioni), non semplicemente la prima con una foto: così la
  // card ha sempre un motivo verificabile per essere "in evidenza".
  const featured = useMemo(() => {
    const ranked = [...strutture].sort(
      (a, b) => b.mediaVoti - a.mediaVoti || b.numeroRecensioni - a.numeroRecensioni,
    );
    return ranked.find((s) => s.urlFotoCopertina) ?? ranked[0];
  }, [strutture]);
  const hasRating = !!featured && featured.mediaVoti > 0;

  const copyIn = useEntrance(0);
  const visualIn = useEntrance(desktop ? 140 : 90);
  const primary = useHover();
  const secondary = useHover();

  return (
    <View style={[styles.section, bgFloodlitHero]}>
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
        <View style={[styles.copy, desktop && styles.copyDesktop, copyIn]}>
          <BrandMark inverse size={42} style={styles.mobileBrand} />
          <View style={styles.eyebrow}>
            <View style={styles.eyebrowLine} />
            <Text style={styles.eyebrowText}>SPORT, SENZA GIRI A VUOTO</Text>
          </View>
          <Text style={[styles.headline, desktop && styles.headlineDesktop]}>
            Il campo giusto,{"\n"}
            <Text style={styles.headlineAccent}>nel momento giusto.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Scopri strutture sportive vicino a te, confronta campi e dettagli
            utili, poi scegli dove giocare senza perdere tempo.
          </Text>
          <View style={styles.actions}>
            <Pressable
              onPress={() => router.push("/search")}
              {...primary.hoverProps}
              style={[
                styles.primaryCta,
                webTransition("transform, box-shadow", 200),
                primary.hovered && styles.primaryCtaHover,
              ]}
            >
              <Text style={styles.primaryCtaText}>Esplora i campi</Text>
              <Icon name="arrow-forward" size={18} color="ink" />
            </Pressable>
            <Pressable
              onPress={() => router.push("/gestori" as never)}
              {...secondary.hoverProps}
              style={[styles.secondaryCta, webTransition("opacity", 160), secondary.hovered && { opacity: 0.7 }]}
            >
              <Text style={styles.secondaryCtaText}>Sei una struttura?</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.visual, desktop && styles.visualDesktop, visualIn]}>
          <MediaStruttura
            photoUrl={featured?.urlFotoCopertina}
            sportId={featured?.idSport[0]}
            height={desktop ? 560 : 340}
            style={styles.photo}
          >
            <View style={styles.photoShade} />
            {hasRating ? (
              <View style={styles.photoStats}>
                <Text style={styles.photoStatValue}>★ {formatRating(featured!.mediaVoti)}</Text>
                <Text style={styles.photoStatLabel}>
                  {featured!.numeroRecensioni} recensioni
                </Text>
              </View>
            ) : null}
            <View style={styles.photoBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.photoBadgeText}>
                {featured?.nome ?? "Campi selezionati da Atimar"}
              </Text>
              <Text style={styles.photoBadgePrice}>
                {featured?.prezzoDaLabel ?? "Da oggi"}
              </Text>
            </View>
          </MediaStruttura>
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
    gap: theme.spacing.xl,
    minWidth: 0,
  },
  copyDesktop: {
    flex: 0.92,
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
    borderRadius: 2,
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
  primaryCtaHover: {
    transform: [{ translateY: -2 }],
    boxShadow: webElev.hover,
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
    minWidth: 0,
  },
  visualDesktop: {
    flex: 1.08,
  },
  photo: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.overlays.borderOnDark,
    boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
  },
  photoShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.overlays.scrimSoft,
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
  photoBadgePrice: {
    color: theme.colors.lime,
    fontFamily: theme.fonts.displayBold,
    fontSize: 14,
  },
  photoStats: {
    position: "absolute",
    top: theme.spacing.lg,
    left: theme.spacing.lg,
    gap: 2,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.overlays.photoBadgeBg,
    borderWidth: 1,
    borderColor: theme.overlays.borderOnDark,
  },
  photoStatValue: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.displayBold,
    fontSize: 18,
    letterSpacing: -0.4,
  },
  photoStatLabel: {
    color: theme.overlays.subtleOnDark,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 12,
  },
});
