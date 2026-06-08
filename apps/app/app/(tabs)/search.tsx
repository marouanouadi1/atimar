import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { getCourtListItemById, getCourtListItems } from "@atimar/data";
import { filterCourts } from "@atimar/utils";
import {
  CourtCard,
  EmptyState,
  FilterChip,
  Icon,
  MapPreview,
  ScreenContainer,
  SearchBar,
  textStyle,
} from "@/ui";
import { useAppState } from "@/state/AppState";

type ViewMode = "list" | "map";

export default function Search() {
  const router = useRouter();
  const { filters, isFavCourt, toggleFavCourt } = useAppState();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const results = useMemo(() => {
    const base = filterCourts(getCourtListItems(), filters);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (c) =>
        c.venueName.toLowerCase().includes(q) ||
        c.sport.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q),
    );
  }, [filters, query]);

  const selected = selectedId ? getCourtListItemById(selectedId) : undefined;
  const openVenue = (venueId: string) =>
    router.push({ pathname: "/venue/[id]", params: { id: venueId } });

  return (
    <ScreenContainer>
      <View style={styles.body}>
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Cerca campi, sport, zone…"
            />
          </View>
          <Pressable
            onPress={() => router.push("/filters")}
            style={styles.filterBtn}
            accessibilityLabel="Filtri"
          >
            <Icon
              name="options-outline"
              size={theme.iconSizes.lg}
              color="ink"
            />
            {filters.active > 0 ? (
              <View style={styles.filterBadge}>
                <Text style={textStyle("micro", "ink")}>{filters.active}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View style={styles.toolbar}>
          <Text style={textStyle("caption", "muted")}>
            {results.length} {results.length === 1 ? "campo" : "campi"}
          </Text>
          <View style={styles.segment}>
            <FilterChip
              label="Lista"
              variant="segment"
              active={view === "list"}
              onPress={() => setView("list")}
            />
            <FilterChip
              label="Mappa"
              variant="segment"
              active={view === "map"}
              onPress={() => setView("map")}
            />
          </View>
        </View>

        {results.length === 0 ? (
          <EmptyState
            icon="search"
            title="Nessun campo trovato"
            desc="Prova a modificare i filtri o ad ampliare la distanza di ricerca."
          />
        ) : view === "list" ? (
          <View style={styles.list}>
            {results.map((court) => (
              <CourtCard
                key={court.id}
                court={court}
                variant="compact"
                isFav={isFavCourt(court.id)}
                onFav={() => toggleFavCourt(court.id)}
                onPress={() => openVenue(court.venueId)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.mapWrap}>
            <MapPreview
              courts={results}
              selectedId={selectedId}
              onSelect={setSelectedId}
              height={380}
            />
            {selected ? (
              <CourtCard
                court={selected}
                variant="compact"
                onPress={() => openVenue(selected.venueId)}
              />
            ) : (
              <Text style={[textStyle("caption", "subtle"), styles.hint]}>
                Tocca un campo sulla mappa per i dettagli.
              </Text>
            )}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { gap: theme.spacing.lg, paddingTop: theme.spacing.sm },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  filterBtn: {
    width: theme.layout.searchHeight,
    height: theme.layout.searchHeight,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  filterBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  segment: {
    flexDirection: "row",
    backgroundColor: theme.colors.chip,
    borderRadius: theme.radius.pill,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
    width: 180,
  },
  list: { gap: theme.spacing.md },
  mapWrap: { gap: theme.spacing.md },
  hint: { textAlign: "center" },
});
