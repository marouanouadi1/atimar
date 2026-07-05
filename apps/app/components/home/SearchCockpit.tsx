import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { SPORTS } from "@atimar/data";
import { theme } from "@/theme/tokens";
import { Icon } from "@/ui";
import { useAppState } from "@/state/AppState";

const PINNED_SPORT_IDS = ["padel", "tennis", "calcio5", "calcio7"];

const SPORT_OPTIONS = [
  { id: "all", label: "Tutti" },
  ...PINNED_SPORT_IDS.flatMap((id) => {
    const s = SPORTS.find((s) => s.id === id);
    return s ? [{ id: s.id, label: s.label }] : [];
  }),
];

interface Props {
  initialSport?: string;
}

export function SearchCockpit({ initialSport = "all" }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { filtri, setFiltri } = useAppState();
  const desktop = width >= theme.breakpoints.tablet;
  const selected = filtri.sport || initialSport;

  const chooseSport = (sport: string) => {
    setFiltri({ ...filtri, sport });
  };

  return (
    <View
      style={[
        styles.shell,
        {
          width: desktop
            ? Math.min(width - theme.layout.screenPadDesktop * 2, 1120)
            : width - theme.layout.screenPadX * 2,
        },
        desktop && styles.shellDesktop,
      ]}
    >
      <View style={styles.titleBlock}>
        <Text style={styles.kicker}>RICERCA RAPIDA</Text>
        <Text style={styles.title}>Parti dallo sport</Text>
        <Text style={styles.subtitle}>Scegli una categoria e apri subito i campi disponibili.</Text>
      </View>
      <View style={styles.sports}>
        {SPORT_OPTIONS.map((sport) => {
          const active = selected === sport.id;
          return (
            <Pressable
              key={sport.id}
              onPress={() => chooseSport(sport.id)}
              style={[styles.sport, active && styles.sportActive]}
            >
              <Text style={[styles.sportText, active && styles.sportTextActive]}>
                {sport.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable onPress={() => router.push("/search")} style={styles.cta}>
        <Icon name="search" size={19} color="ink" />
        <Text style={styles.ctaText}>Apri la ricerca</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignSelf: "center",
    marginTop: -38,
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    boxSizing: "border-box",
    ...theme.shadows.pop,
  },
  shellDesktop: {
    maxWidth: 1120,
    alignSelf: "center",
    marginTop: -46,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xxl,
  },
  titleBlock: {
    gap: 2,
    minWidth: 210,
  },
  kicker: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.displayBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.displayBold,
    fontSize: 20,
    letterSpacing: -0.4,
  },
  subtitle: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 300,
  },
  sports: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  sport: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.chip,
    borderWidth: 1,
    borderColor: "transparent",
  },
  sportActive: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.lime,
  },
  sportText: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 13,
  },
  sportTextActive: {
    color: theme.colors.surface,
  },
  cta: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lime,
    ...theme.shadows.lime,
  },
  ctaText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
  },
});
