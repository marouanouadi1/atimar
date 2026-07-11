import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { theme, sportColor } from "@/theme/tokens";
import { Icon, bgWarmLight, isWeb, useHover, webElev, webTransition } from "@/ui";
import { useAppState } from "@/state/AppState";

const SPORTS = [
  { id: "padel", label: "Padel", icon: "tennisball" },
  { id: "tennis", label: "Tennis", icon: "tennisball-outline" },
  { id: "calcio5", label: "Calcio 5", icon: "football" },
  { id: "beachvolley", label: "Beach Volley", icon: "sunny" },
  { id: "basket", label: "Basket", icon: "basketball" },
  { id: "all", label: "Tutti gli sport", icon: "grid-outline" },
] as const;

/** Single sport tile with a colored hover glow (web). */
function SportTile({
  label,
  icon,
  color,
  isDesktop,
  onPress,
}: {
  label: string;
  icon: string;
  color: string;
  isDesktop: boolean;
  onPress: () => void;
}) {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable
      onPress={onPress}
      {...hoverProps}
      style={({ pressed }) => [
        styles.tile,
        isDesktop && styles.tileDesktop,
        isWeb && styles.tileElev,
        webTransition("transform, box-shadow, border-color", 200),
        hovered && { transform: [{ translateY: -6 }], boxShadow: `0 18px 40px ${color}38`, borderColor: color },
        pressed && { opacity: 0.9 },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: hovered ? `${color}30` : `${color}18` },
          webTransition("background-color", 200),
        ]}
      >
        <Icon name={icon} size={26} color={color} />
      </View>
      <Text style={styles.tileLabel}>{label}</Text>
      <View style={[styles.tileAction, hovered && { backgroundColor: color }]}>
        <Icon name="arrow-forward" size={16} color={hovered ? theme.colors.surface : color} />
      </View>
    </Pressable>
  );
}

/** Sport category tiles grid for the web homepage. */
export function SportCategoryGrid() {
  const router = useRouter();
  const { filtri, setFiltri } = useAppState();
  const { width } = useWindowDimensions();
  const isDesktop = width >= theme.breakpoints.desktop;

  const navigateToSport = (id: string) => {
    setFiltri({ ...filtri, sport: id });
    router.push("/search");
  };

  return (
    <View style={[styles.section, bgWarmLight, isDesktop && styles.sectionDesktop]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CATEGORIE</Text>
        <Text style={[styles.heading, isDesktop && styles.headingDesktop]}>
          Esplora per sport
        </Text>
      </View>

      <View style={[styles.grid, isDesktop && styles.gridDesktop]}>
        {SPORTS.map((sport) => (
          <SportTile
            key={sport.id}
            label={sport.label}
            icon={sport.icon}
            color={sport.id === "all" ? theme.colors.primary : sportColor(sport.id)}
            isDesktop={isDesktop}
            onPress={() => navigateToSport(sport.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: theme.layout.screenPadX,
    paddingVertical: 64,
    gap: theme.spacing.xl,
  },
  sectionDesktop: {
    maxWidth: theme.layout.maxContent,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: theme.layout.screenPadDesktop,
  },
  heading: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.displayBold,
    fontSize: 22,
    letterSpacing: -0.44,
  },
  header: {
    gap: theme.spacing.xs,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.displayBold,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  headingDesktop: {
    fontSize: 28,
    letterSpacing: -0.8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  gridDesktop: {
    flexWrap: "nowrap",
    gap: theme.spacing.lg,
  },
  tile: {
    flexBasis: "30%",
    flexGrow: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    alignItems: "flex-start",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    ...theme.shadows.card,
  },
  // web-only elevated resting shadow (overrides the flat native card shadow)
  tileElev: {
    boxShadow: webElev.rest,
  },
  tileDesktop: {
    flexBasis: 0,
    flex: 1,
    padding: theme.spacing.xl,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  tileLabel: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    letterSpacing: -0.14,
    marginTop: theme.spacing.xs,
  },
  tileAction: {
    position: "absolute",
    right: theme.spacing.md,
    top: theme.spacing.md,
    width: 28,
    height: 28,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.bg,
  },
});
