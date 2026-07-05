import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { theme, sportColor } from "@/theme/tokens";
import { DEFAULT_FILTERS } from "@atimar/data";
import { filtraCampi } from "@atimar/utils";
import {
  CampoCard,
  EmptyState,
  FilterChip,
  Icon,
  MapPreview,
  ScreenContainer,
  SearchBar,
  textStyle,
} from "@/ui";
import { useAppState } from "@/state/AppState";
import { useCampiInLista, useNearbyCampiInLista } from "@/data/hooks";
import { useUserLocation } from "@/data/use-user-location";
import type { CampoInLista } from "@atimar/types";

type ViewMode = "list" | "map";

const QUICK_SPORTS = [
  { id: "all", label: "Tutti" },
  { id: "padel", label: "Padel" },
  { id: "tennis", label: "Tennis" },
  { id: "calcio5", label: "Calcio 5" },
  { id: "beachvolley", label: "Beach Volley" },
  { id: "basket", label: "Basket" },
];

export default function Search() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { filtri, setFiltri, isPreferitoCampo, togglePreferitoCampo } = useAppState();
  const [query, setQuery] = useState(q ?? "");
  const [view, setView] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const { data: campi = [], isLoading: isCatalogLoading } = useCampiInLista();
  const userLocation = useUserLocation();
  const nearbyQuery = useNearbyCampiInLista({
    location: userLocation.location,
    filtri,
    limit: 250,
  });
  const useNearbySearch = userLocation.hasLocation;
  const nearbyError = useNearbySearch ? nearbyQuery.error : null;

  const results = useMemo(() => {
    const source = useNearbySearch
      ? nearbyQuery.data?.campiInLista ?? []
      : filtraCampi(campi, filtri);
    const testo = query.trim().toLowerCase();
    if (!testo) return source;
    return source.filter(
      (c) =>
        c.nomeStruttura.toLowerCase().includes(testo) ||
        c.nome.toLowerCase().includes(testo) ||
        c.nomeSport.toLowerCase().includes(testo) ||
        c.indirizzo.toLowerCase().includes(testo),
    );
  }, [
    campi,
    filtri,
    nearbyQuery.data?.campiInLista,
    query,
    useNearbySearch,
  ]);
  const isLoading = useNearbySearch
    ? nearbyQuery.isLoading
    : isCatalogLoading;

  const selected: CampoInLista | undefined = selectedId
    ? results.find((c) => c.id === selectedId)
    : undefined;

  const apriStruttura = (strutturaId: string) =>
    router.push({ pathname: "/struttura/[id]", params: { id: strutturaId } });

  const setSport = (id: string) => setFiltri({ ...filtri, sport: id });

  return (
    <ScreenContainer>
      <View style={styles.body}>
        <View style={styles.heading}>
          <Text style={styles.kicker}>DISCOVER</Text>
          <Text style={styles.title}>Trova il tuo campo</Text>
        </View>
        {/* Barra cerca + filtri */}
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
            style={[styles.filterBtn, filtri.attivi > 0 && styles.filterBtnActive]}
            accessibilityLabel="Filtri"
          >
            <Icon
              name="options-outline"
              size={theme.iconSizes.lg}
              color={filtri.attivi > 0 ? "primary" : "ink"}
            />
            {filtri.attivi > 0 && (
              <View style={styles.filterBadge}>
                <Text style={textStyle("micro", "ink")}>{filtri.attivi}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Filtro rapido per sport */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sportChips}
        >
          {QUICK_SPORTS.map((s) => {
            const active = filtri.sport === s.id;
            const accent = s.id === "all" ? theme.colors.primary : sportColor(s.id);
            return (
              <Pressable
                key={s.id}
                onPress={() => setSport(s.id)}
                style={[
                  styles.sportChip,
                  active && { backgroundColor: accent, borderColor: accent },
                ]}
              >
                <Text
                  style={[
                    styles.sportChipText,
                    active && { color: "#fff" },
                  ]}
                >
                  {s.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Intestazione risultati */}
        {!isLoading && !nearbyError && (
          <View style={styles.toolbar}>
            <View style={styles.resultInfo}>
              <Text style={textStyle("bodyStrong", "ink")}>
                {results.length}
              </Text>
              <Text style={textStyle("caption", "muted")}>
                {" "}{results.length === 1 ? "campo trovato" : "campi trovati"}
              </Text>
              {filtri.attivi > 0 && (
                <Pressable
                  onPress={() => setFiltri(DEFAULT_FILTERS)}
                  style={styles.clearFilters}
                >
                  <Text style={textStyle("caption", "primary")}>Rimuovi filtri</Text>
                </Pressable>
              )}
            </View>
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
        )}

        {/* Risultati */}
        {isLoading ? (
          <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
        ) : nearbyError ? (
          <EmptyState
            icon="alert-circle"
            title="Ricerca per distanza non disponibile"
            desc="Configura la funzione Supabase search_campi_nearby per usare la posizione."
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon="search"
            title="Nessun campo trovato"
            desc="Prova a modificare i filtri o ad ampliare la distanza di ricerca."
          />
        ) : view === "list" ? (
          isDesktop ? (
            <View style={styles.gridDesktop}>
              {results.map((campo) => (
                <View key={campo.id} style={styles.gridItem}>
                  <CampoCard
                    campo={campo}
                    variant="large"
                    isFav={isPreferitoCampo(campo.id)}
                    onFav={() => void togglePreferitoCampo(campo.id)}
                    onPress={() => apriStruttura(campo.strutturaId)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.list}>
              {results.map((campo) => (
                <CampoCard
                  key={campo.id}
                  campo={campo}
                  variant="compact"
                  isFav={isPreferitoCampo(campo.id)}
                  onFav={() => void togglePreferitoCampo(campo.id)}
                  onPress={() => apriStruttura(campo.strutturaId)}
                />
              ))}
            </View>
          )
        ) : (
          <View style={styles.mapWrap}>
            <MapPreview
              campi={results}
              selectedId={selected?.id}
              onSelect={setSelectedId}
              radius={filtri.distanzaMax}
              userLocation={userLocation.location}
              locationStatus={userLocation.status}
              onRequestLocation={userLocation.requestLocation}
              height={380}
            />
            {selected ? (
              <CampoCard
                campo={selected}
                variant="compact"
                onPress={() => apriStruttura(selected.strutturaId)}
              />
            ) : (
              <Text style={[textStyle("caption", "subtle"), styles.hint]}>
                Tocca un marker per vedere il campo.
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
  heading: { gap: 2, paddingTop: theme.spacing.lg },
  kicker: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.displayBold,
    fontSize: 10,
    letterSpacing: 1.6,
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.displayBold,
    fontSize: 32,
    letterSpacing: -0.9,
  },
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
  filterBtnActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.tints.blueTint,
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
  sportChips: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  sportChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.chip,
  },
  sportChipText: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  resultInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  clearFilters: {
    marginLeft: theme.spacing.sm,
    paddingVertical: 2,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.tints.blueTint,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: theme.colors.chip,
    borderRadius: theme.radius.pill,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  list: { gap: theme.spacing.md },
  gridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.lg,
  },
  gridItem: {
    flexBasis: 300,
    flexGrow: 1,
    maxWidth: 360,
  },
  mapWrap: { gap: theme.spacing.md },
  hint: { textAlign: "center" },
  loader: { paddingVertical: theme.spacing.xxxl },
});
