import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { SPORTS } from "@atimar/data";
import { theme } from "@/theme/tokens";
import { Icon, SportChip, useHover, webElev, webTransition } from "@/ui";
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
  // Unica soglia mobile↔desktop (1024) condivisa da tutte le sezioni della
  // homepage: evita che nel range tablet alcune sezioni passino a desktop e
  // altre restino mobile, creando layout incoerenti.
  const desktop = width >= theme.breakpoints.desktop;
  const selected = filtri.sport || initialSport;
  const cta = useHover();

  const chooseSport = (sport: string) => {
    setFiltri({ ...filtri, sport });
  };

  return (
    <View
      style={[
        styles.shell,
        { boxShadow: webElev.float },
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
        {SPORT_OPTIONS.map((sport) => (
          <SportChip
            key={sport.id}
            label={sport.label}
            active={selected === sport.id}
            onPress={() => chooseSport(sport.id)}
          />
        ))}
      </View>
      <Pressable
        onPress={() => router.push("/search")}
        {...cta.hoverProps}
        style={[
          styles.cta,
          webTransition("transform, box-shadow", 200),
          cta.hovered && styles.ctaHover,
        ]}
      >
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
  ctaHover: {
    transform: [{ translateY: -2 }],
    boxShadow: "0 14px 30px rgba(147,185,0,0.45)",
  },
  ctaText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
  },
});
