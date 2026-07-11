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

import { theme } from "@/theme/tokens";
import { DEFAULT_FILTERS } from "@atimar/data";
import { filtraCampi } from "@atimar/utils";
import {
  Button,
  CampoCard,
  EmptyState,
  FilterChip,
  Icon,
  IconButton,
  MapPreview,
  ScreenContainer,
  SearchBar,
  textStyle,
} from "@/ui";
import { useAppState } from "@/state/AppState";
import { useCampiInLista, useNearbyCampiInLista } from "@/data/hooks";
import { useUserLocation } from "@/data/use-user-location";
import type { CampoInLista, GeoPoint } from "@atimar/types";

type ViewMode = "list" | "map";

export default function Search() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const padX = isDesktop ? theme.layout.screenPadDesktop : theme.layout.screenPadX;
  const { filtri, setFiltri, isPreferitoCampo, togglePreferitoCampo } = useAppState();
  const [query, setQuery] = useState(q ?? "");
  const [view, setView] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  // Origine e raggio impostati automaticamente quando l'utente sposta o
  // zooma la mappa: hanno priorità sulla posizione GPS e su filtri.distanzaMax
  // finché l'utente non resetta la zona (vedi resetArea/resetAll).
  const [manualOrigin, setManualOrigin] = useState<GeoPoint | null>(null);
  const [manualRadiusKm, setManualRadiusKm] = useState<number | null>(null);

  const { data: campi = [], isLoading: isCatalogLoading } = useCampiInLista();
  const userLocation = useUserLocation();
  const searchOrigin = manualOrigin ?? userLocation.location ?? null;
  const nearbyQuery = useNearbyCampiInLista({
    location: searchOrigin,
    filtri,
    radiusKm: manualRadiusKm ?? undefined,
    limit: 250,
  });
  const useNearbySearch = !!searchOrigin;
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
  // `nearbyQuery.isLoading` può restare `false` per un render subito dopo che
  // `useNearbySearch` diventa vero (es. GPS risolto dopo il fallback sul
  // catalogo): controllare anche l'assenza di dati evita il flash "0 campi"
  // prima che arrivi il primo risultato della ricerca per posizione.
  const isLoading = useNearbySearch
    ? (nearbyQuery.isLoading || nearbyQuery.data === undefined) && !nearbyError
    : isCatalogLoading;

  const selected: CampoInLista | undefined = selectedId
    ? results.find((c) => c.id === selectedId)
    : undefined;

  // Passa con sé il campo da cui si è navigato: la scheda struttura apre
  // già sulla tab "Campi" filtrata sullo stesso sport, così chi arriva da
  // una ricerca/filtro non deve rifiltrare da capo. Su un campo polivalente
  // trovato tramite un filtro sport specifico, usa quello sport (non lo sport
  // primario del campo) così la scheda apre sul filtro coerente con la ricerca.
  const apriStruttura = (campo: CampoInLista) =>
    router.push({
      pathname: "/struttura/[id]",
      params: {
        id: campo.strutturaId,
        campoId: campo.id,
        sport:
          filtri.sport !== "all" && campo.sportIds.includes(filtri.sport)
            ? filtri.sport
            : campo.idSport,
      },
    });

  // Torna a "Vicino a te" / catalogo, abbandonando la zona cercata manualmente.
  const resetArea = () => {
    setManualOrigin(null);
    setManualRadiusKm(null);
  };
  // Ripristina zona, filtri e testo di ricerca allo stato iniziale.
  const resetAll = () => {
    setManualOrigin(null);
    setManualRadiusKm(null);
    setFiltri(DEFAULT_FILTERS);
    setQuery("");
  };
  // Se la mappa ha già derivato un raggio dal viewport lo allarga; altrimenti
  // agisce sulla preferenza distanza dei filtri.
  const widenRadius = () =>
    manualRadiusKm != null
      ? setManualRadiusKm(Math.round(manualRadiusKm * 1.5))
      : setFiltri({ ...filtri, distanzaMax: Math.min(50, filtri.distanzaMax + 10) });

  const scopeLabel = useNearbySearch
    ? manualOrigin
      ? "In questa zona"
      : "Vicino a te"
    : "Tutto il catalogo";

  const primaryEmptyAction = manualOrigin
    ? userLocation.hasLocation
      ? { label: "Cerca vicino a me", onPress: resetArea }
      : { label: "Allarga il raggio", onPress: widenRadius }
    : filtri.attivi > 0
      ? { label: "Rimuovi filtri", onPress: () => setFiltri(DEFAULT_FILTERS) }
      : useNearbySearch
        ? { label: "Allarga il raggio", onPress: widenRadius }
        : null;
  const showResetAll =
    !!manualOrigin || filtri.attivi > 0 || query.trim().length > 0;

  return (
    <ScreenContainer scroll={false} contentStyle={styles.screenContent}>
      <View style={[styles.fixedTop, { paddingHorizontal: padX }]}>
        {view === "list" ? (
          <View style={styles.heading}>
            <Text style={styles.kicker}>TROVA CAMPO</Text>
            <Text style={styles.title}>Trova il tuo campo</Text>
            <Text style={styles.subtitle}>
              Cerca per struttura o campo e confronta subito i campi disponibili.
            </Text>
          </View>
        ) : null}

        {/* Barra cerca + filtri */}
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Cerca per struttura o campo…"
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

        {/* Intestazione risultati + cambio vista (solo lista: in mappa lo
            scope vive nella chip flottante). Il toggle Lista/Mappa resta
            sempre visibile anche durante caricamento o errore, così non si
            resta mai bloccati senza modo di raggiungere la mappa. */}
        {view === "list" ? (
          <View style={styles.toolbar}>
            {!isLoading && !nearbyError ? (
              <View style={styles.resultInfo}>
                <View style={styles.resultCount}>
                  <Text style={styles.resultCountNumber}>
                    {results.length}
                  </Text>
                </View>
                <View style={styles.resultCopy}>
                  <Text style={textStyle("bodyStrong", "ink")}>
                    {results.length === 1 ? "1 campo trovato" : `${results.length} campi trovati`}
                  </Text>
                  <Text style={textStyle("caption", "muted")}>{scopeLabel}</Text>
                </View>
                {filtri.attivi > 0 && (
                  <Pressable
                    onPress={() => setFiltri(DEFAULT_FILTERS)}
                    style={styles.clearFilters}
                  >
                    <Text style={textStyle("caption", "primary")}>Rimuovi filtri</Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <View style={styles.resultInfo} />
            )}
            <View style={styles.segment}>
              <FilterChip
                label="Lista"
                variant="segment"
                active
                onPress={() => setView("list")}
              />
              <FilterChip
                label="Mappa"
                variant="segment"
                active={false}
                onPress={() => setView("map")}
              />
            </View>
          </View>
        ) : isLoading || nearbyError ? (
          // In mappa il toggle vive normalmente nei controlli flottanti sulla
          // mappa stessa: se però siamo bloccati su caricamento/errore quei
          // controlli non sono renderizzati, quindi serve comunque una via
          // per tornare alla lista.
          <View style={styles.toolbar}>
            <View style={styles.resultInfo} />
            <View style={styles.segment}>
              <FilterChip
                label="Lista"
                variant="segment"
                active={false}
                onPress={() => setView("list")}
              />
              <FilterChip
                label="Mappa"
                variant="segment"
                active
                onPress={() => setView("map")}
              />
            </View>
          </View>
        ) : null}
      </View>

      {/* Contenuto: lista scrollabile oppure mappa immersiva */}
      {isLoading ? (
        <View style={[styles.loaderWrap, { paddingHorizontal: padX }]}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : nearbyError ? (
        <View style={[styles.loaderWrap, { paddingHorizontal: padX }]}>
          <EmptyState
            icon="alert-circle"
            title="Ricerca per distanza non disponibile"
            desc="Al momento non riusciamo a usare la posizione. Puoi disattivarla o riprovare più tardi."
          />
        </View>
      ) : view === "list" ? (
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: padX }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {results.length === 0 ? (
            <EmptyState
              icon="search"
              title="Nessun campo trovato"
              desc="Prova a modificare i filtri o ad ampliare la distanza di ricerca."
              cta={
                primaryEmptyAction || showResetAll ? (
                  <View style={styles.emptyActions}>
                    {primaryEmptyAction ? (
                      <Button variant="lime" onPress={primaryEmptyAction.onPress}>
                        {primaryEmptyAction.label}
                      </Button>
                    ) : null}
                    {showResetAll ? (
                      <Pressable onPress={resetAll} style={styles.emptyLink} hitSlop={8}>
                        <Text style={textStyle("caption", "primary")}>
                          Vedi tutto il catalogo
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                ) : undefined
              }
            />
          ) : isDesktop ? (
            <View style={styles.gridDesktop}>
              {results.map((campo) => (
                <View key={campo.id} style={styles.gridItem}>
                  <CampoCard
                    campo={campo}
                    variant="large"
                    isFav={isPreferitoCampo(campo.id)}
                    onFav={() => void togglePreferitoCampo(campo.id)}
                    onPress={() => apriStruttura(campo)}
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
                  onPress={() => apriStruttura(campo)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.mapArea}>
          <MapPreview
            fill
            campi={results}
            selectedId={selected?.id}
            onSelect={setSelectedId}
            radius={manualRadiusKm ?? filtri.distanzaMax}
            userLocation={userLocation.location}
            locationStatus={userLocation.status}
            onRequestLocation={userLocation.requestLocation}
            searchOrigin={searchOrigin}
            onSearchArea={(center, radiusKm) => {
              setManualOrigin(center);
              setManualRadiusKm(radiusKm);
            }}
          />

          <View style={styles.scopeChipWrap} pointerEvents="box-none">
            <View style={styles.scopeChip}>
              <Text style={textStyle("caption", "ink")} numberOfLines={1}>
                {results.length} {results.length === 1 ? "campo" : "campi"} · {scopeLabel}
              </Text>
              {manualOrigin ? (
                <Pressable
                  onPress={resetArea}
                  hitSlop={8}
                  accessibilityLabel="Reimposta zona di ricerca"
                >
                  <Icon name="close-circle" size={theme.iconSizes.md} color="muted" />
                </Pressable>
              ) : null}
            </View>
          </View>

          {selected ? (
            <View style={styles.floatingCard}>
              <View style={styles.floatingCardTopRow}>
                <Pressable
                  onPress={() => setView("list")}
                  style={({ pressed }) => [styles.listPill, pressed && styles.pressed]}
                >
                  <Icon name="list-outline" size={theme.iconSizes.sm} color="ink" />
                  <Text style={textStyle("caption", "ink")}>Lista</Text>
                </Pressable>
                <IconButton
                  name="close"
                  tone="glass"
                  size={32}
                  iconSize={theme.iconSizes.md}
                  onPress={() => setSelectedId(undefined)}
                  accessibilityLabel="Chiudi scheda campo"
                />
              </View>
              <CampoCard
                campo={selected}
                variant="compact"
                isFav={isPreferitoCampo(selected.id)}
                onFav={() => void togglePreferitoCampo(selected.id)}
                onPress={() => apriStruttura(selected)}
              />
              <Button onPress={() => apriStruttura(selected)} icon>
                Vedi struttura
              </Button>
            </View>
          ) : (
            <View style={styles.bottomBar}>
              {results.length === 0 ? (
                <View style={styles.bottomBarRow}>
                  <Icon name="search" size={theme.iconSizes.md} color="muted" />
                  <Text style={[textStyle("caption", "muted"), { flex: 1 }]}>
                    Nessun campo in questa zona. Sposta la mappa o allarga il raggio.
                  </Text>
                </View>
              ) : null}
              <Pressable
                onPress={() => setView("list")}
                style={({ pressed }) => [styles.listPillFull, pressed && styles.pressed]}
              >
                <Icon name="list-outline" size={theme.iconSizes.sm} color="ink" />
                <Text style={textStyle("bodyStrong", "ink")}>
                  Vedi lista · {results.length}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingHorizontal: 0, paddingBottom: 0 },
  fixedTop: { gap: theme.spacing.md, paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.sm },
  heading: { gap: theme.spacing.xs },
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
  subtitle: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 620,
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
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  resultInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  resultCount: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.tints.blueTint,
  },
  resultCountNumber: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.displayBold,
    fontSize: 18,
    fontVariant: ["tabular-nums"],
  },
  resultCopy: {
    gap: 1,
  },
  clearFilters: {
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
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: theme.spacing.xxxl,
  },
  listScroll: { flex: 1 },
  listContent: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xxxl,
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
  emptyActions: { gap: theme.spacing.sm, alignItems: "center", alignSelf: "stretch" },
  emptyLink: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.sm },
  // Mappa immersiva: riempie tutto lo spazio residuo, edge-to-edge.
  mapArea: { flex: 1, position: "relative" },
  scopeChipWrap: {
    position: "absolute",
    top: theme.spacing.md,
    left: theme.spacing.md,
    maxWidth: "62%",
    zIndex: 1000,
  },
  scopeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    minHeight: 36,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.overlays.glass,
    borderWidth: 1,
    borderColor: theme.overlays.glassLine,
    ...theme.shadows.floatBtn,
  },
  floatingCard: {
    position: "absolute",
    left: theme.spacing.md,
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  floatingCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    height: 32,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.overlays.glass,
    borderWidth: 1,
    borderColor: theme.overlays.glassLine,
    ...theme.shadows.floatBtn,
  },
  bottomBar: {
    position: "absolute",
    left: theme.spacing.md,
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.overlays.glass,
    borderWidth: 1,
    borderColor: theme.overlays.glassLine,
    ...theme.shadows.floatBtn,
  },
  bottomBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  listPillFull: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lime,
  },
  pressed: { opacity: 0.82 },
});
