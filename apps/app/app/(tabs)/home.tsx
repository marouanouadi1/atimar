import { useMemo } from "react";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { getCourtListItems, sportLabel } from "@atimar/data";
import { sortCourts } from "@atimar/utils";
import {
  CourtCard,
  MapPreview,
  ScreenContainer,
  SearchBar,
  SectionHeaderRow,
  SportChip,
  textStyle,
} from "@/ui";
import { useAppState } from "@/state/AppState";

export default function Home() {
  const router = useRouter();
  const { user, prefs, filters, setFilters, isFavCourt, toggleFavCourt } =
    useAppState();

  const courts = useMemo(() => getCourtListItems(), []);
  const popular = useMemo(
    () => sortCourts(courts, "rating").slice(0, 5),
    [courts],
  );
  const recommended = useMemo(() => {
    const set = new Set(prefs.sports);
    const mine = courts.filter((c) => set.has(c.sportId));
    return (mine.length ? mine : courts).slice(0, 4);
  }, [courts, prefs.sports]);

  const openVenue = (venueId: string) =>
    router.push({ pathname: "/venue/[id]", params: { id: venueId } });

  const quickSport = (sportId: "all" | string) => {
    setFilters({ ...filters, sport: sportId });
    router.push("/search");
  };

  return (
    <ScreenContainer>
      <View style={styles.body}>
        <View style={styles.greeting}>
          <Text style={textStyle("caption", "muted")}>Bentornato</Text>
          <Text style={textStyle("h1App", "ink")}>
            Ciao {user?.name ?? "Atleta"} 👋
          </Text>
        </View>

        <SearchBar onPress={() => router.push("/search")} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <SportChip
            label="Tutti"
            active={filters.sport === "all"}
            onPress={() => quickSport("all")}
          />
          {prefs.sports.map((id) => (
            <SportChip
              key={id}
              label={sportLabel(id)}
              active={filters.sport === id}
              onPress={() => quickSport(id)}
            />
          ))}
        </ScrollView>

        <View style={styles.section}>
          <SectionHeaderRow
            title="Campi popolari"
            onAction={() => router.push("/search")}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          >
            {popular.map((court) => (
              <CourtCard
                key={court.id}
                court={court}
                variant="large"
                width={260}
                isFav={isFavCourt(court.id)}
                onFav={() => toggleFavCourt(court.id)}
                onPress={() => openVenue(court.venueId)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeaderRow
            title="Consigliati per te"
            onAction={() => router.push("/search")}
          />
          <View style={styles.list}>
            {recommended.map((court) => (
              <CourtCard
                key={court.id}
                court={court}
                variant="compact"
                onPress={() => openVenue(court.venueId)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeaderRow
            title="Intorno a te"
            onAction={() => router.push("/search")}
          />
          <MapPreview courts={courts} height={200} onSelect={openVenue} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { gap: theme.spacing.lg, paddingTop: theme.spacing.sm },
  greeting: { gap: 2 },
  chips: { gap: theme.spacing.sm, paddingVertical: theme.spacing.xs },
  section: { gap: theme.spacing.md },
  carousel: {
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    paddingRight: theme.spacing.lg,
  },
  list: { gap: theme.spacing.md },
});
