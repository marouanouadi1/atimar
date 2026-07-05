import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { theme, sportColor } from "@/theme/tokens";
import { Icon } from "@/ui";
import { useAppState } from "@/state/AppState";

const SPORTS = [
  { id: "padel", label: "Padel", icon: "tennisball" },
  { id: "tennis", label: "Tennis", icon: "tennisball-outline" },
  { id: "calcio5", label: "Calcio 5", icon: "football" },
  { id: "beachvolley", label: "Beach Volley", icon: "sunny" },
  { id: "basket", label: "Basket", icon: "basketball" },
  { id: "all", label: "Tutti gli sport", icon: "grid-outline" },
] as const;

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
    <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CATEGORIE</Text>
        <Text style={[styles.heading, isDesktop && styles.headingDesktop]}>
          Esplora per sport
        </Text>
      </View>

      <View style={[styles.grid, isDesktop && styles.gridDesktop]}>
        {SPORTS.map((sport) => {
          const color = sport.id === "all" ? theme.colors.primary : sportColor(sport.id);
          return (
            <Pressable
              key={sport.id}
              onPress={() => navigateToSport(sport.id)}
              style={({ pressed }) => [
                styles.tile,
                isDesktop && styles.tileDesktop,
                { backgroundColor: theme.colors.surface },
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${color}25` }]}>
                <Icon name={sport.icon} size={26} color={color} />
              </View>
              <Text style={styles.tileLabel}>{sport.label}</Text>
              <View style={styles.tileAction}>
                <Icon name="arrow-forward" size={16} color={color} />
              </View>
            </Pressable>
          );
        })}
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
    borderWidth: 1,
    borderColor: theme.colors.line,
    ...theme.shadows.card,
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
