import { useMemo, useState } from "react";
import { WebFooter } from "@/components/layout/WebFooter";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/theme/tokens";
import { sportLabel } from "@atimar/data";
import { formatRating, ordinaCampi } from "@atimar/utils";
import {
  bgFloodlitHero,
  bgFloodlitPanel,
  CampoCard,
  Icon,
  MediaStruttura,
  noNativeOutline,
  ResponsiveContainer,
  SportChip,
  useHover,
  webTransition,
} from "@/ui";
import { useAppState } from "@/state/AppState";
import { useCampiInLista } from "@/data/hooks";

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const desktop = width >= theme.breakpoints.desktop;
  const { user, filtri, setFiltri, isPreferitoCampo, togglePreferitoCampo } = useAppState();
  const [query, setQuery] = useState("");
  const featuredHover = useHover();
  const searchHover = useHover();
  const clubHover = useHover();

  const { data: campi = [], isLoading } = useCampiInLista();
  const popular = useMemo(() => ordinaCampi(campi, "voti").slice(0, 9), [campi]);
  // Il campo del momento è il primo dei più votati (stesso ordinamento di
  // "Campi da provare"), non una struttura scelta a caso: così la card ha
  // sempre un motivo verificabile per essere in cima alla home.
  const featured = popular[0];
  const hasRating = !!featured && featured.mediaVoti > 0;
  // Sport più frequenti nel catalogo reale, non un elenco fisso: evita che le
  // pillole propongano sport assenti (o ne ignorino altri molto presenti).
  const topSports = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of campi) {
      if (c.idSport) counts.set(c.idSport, (counts.get(c.idSport) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([id]) => id);
  }, [campi]);

  const apriStruttura = (strutturaId: string) =>
    router.push({ pathname: "/struttura/[id]", params: { id: strutturaId } });

  const goSearch = (sportId?: string) => {
    if (sportId) setFiltri({ ...filtri, sport: sportId });
    router.push({ pathname: "/search", params: query.trim() ? { q: query.trim() } : {} });
  };

  return (
    <ScrollView
      style={styles.root}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        process.env.EXPO_OS === "web"
          ? undefined
          : { paddingBottom: insets.bottom + theme.layout.tabBarHeight + theme.spacing.xxxl }
      }
    >
      <View style={[styles.heroBg, bgFloodlitHero]}>
        <ResponsiveContainer style={{ paddingTop: desktop ? theme.spacing.xxxl : insets.top + theme.spacing.lg, paddingBottom: theme.spacing.xxxl }}>
          <View style={[styles.hero, desktop && styles.heroDesktop]}>
          <View style={styles.heroCopy}>
            <Text style={styles.kicker}>READY WHEN YOU ARE</Text>
            <Text style={[styles.title, desktop && styles.titleDesktop]}>
              {user ? (
                <>
                  Ciao {user.name?.split(" ")[0] ?? "Atleta"},{"\n"}
                  <Text style={styles.titleAccent}>dove giochiamo?</Text>
                </>
              ) : (
                <>
                  {"Il campo giusto,\n"}
                  <Text style={styles.titleAccent}>nel momento giusto.</Text>
                </>
              )}
            </Text>
            <Text style={styles.subtitle}>
              Cerca il prossimo campo oppure riparti dai tuoi sport preferiti.
            </Text>

            <View style={styles.search}>
              <Icon name="search" size={20} color="muted" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => goSearch()}
                placeholder="Campo, struttura o zona"
                placeholderTextColor={theme.colors.subtle}
                returnKeyType="search"
                style={styles.searchInput}
              />
              <Pressable
                onPress={() => goSearch()}
                {...searchHover.hoverProps}
                style={[
                  styles.searchButton,
                  webTransition("transform, box-shadow", 180),
                  searchHover.hovered && styles.searchButtonHover,
                ]}
              >
                <Icon name="arrow-forward" size={19} color="ink" />
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.sportsScroll}
              contentContainerStyle={styles.sports}
            >
              <SportChip
                label="Tutti"
                active={filtri.sport === "all"}
                onPress={() => goSearch("all")}
              />
              {topSports.map((id) => (
                <SportChip
                  key={id}
                  label={sportLabel(id)}
                  active={filtri.sport === id}
                  onPress={() => goSearch(id)}
                />
              ))}
            </ScrollView>
          </View>

          <Pressable
            onPress={() => featured && apriStruttura(featured.strutturaId)}
            {...featuredHover.hoverProps}
            style={[
              styles.featured,
              webTransition("transform", 260),
              featuredHover.hovered && styles.featuredHover,
            ]}
          >
            <MediaStruttura
              photoUrl={featured?.urlFotoCopertina}
              sportId={featured?.idSport}
              height={desktop ? 420 : 250}
              style={styles.featuredMedia}
            >
              <View style={styles.featuredLabel}>
                <Text style={styles.featuredKicker}>
                  {hasRating ? "MIGLIORE VALUTAZIONE" : "CONSIGLIATO"}
                </Text>
                <Text style={styles.featuredName} numberOfLines={1}>
                  {featured?.nomeStruttura ?? "Scopri le strutture Atimar"}
                </Text>
                <Text style={styles.featuredMeta}>
                  {featured
                    ? hasRating
                      ? `★ ${formatRating(featured.mediaVoti)} · ${featured.nomeSport}`
                      : `${featured.nomeSport} · ${featured.prezzoLabel}`
                    : "Esplora ora"}
                </Text>
              </View>
            </MediaStruttura>
          </Pressable>
          </View>
        </ResponsiveContainer>
      </View>

      <ResponsiveContainer style={styles.page}>
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={styles.sectionKicker}>SCELTI PER TE</Text>
              <Text style={styles.sectionTitle}>Campi da provare</Text>
            </View>
            <Pressable onPress={() => router.push("/search")}>
              <Text style={styles.seeAll}>Vedi tutti →</Text>
            </Pressable>
          </View>

          {isLoading ? (
            <ActivityIndicator color={theme.colors.primary} style={styles.loader} />
          ) : popular.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="tennisball-outline" size={28} color="muted" />
              <Text style={styles.emptyText}>Nessun campo disponibile al momento.</Text>
            </View>
          ) : (
            <View style={desktop ? styles.grid : styles.list}>
              {popular.map((campo) => (
                <View key={campo.id} style={desktop ? styles.gridItem : styles.listItem}>
                  <CampoCard
                    campo={campo}
                    variant={desktop ? "large" : "compact"}
                    isFav={isPreferitoCampo(campo.id)}
                    onFav={() => void togglePreferitoCampo(campo.id)}
                    onPress={() => apriStruttura(campo.strutturaId)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        <Pressable
          onPress={() => router.push("/gestori" as never)}
          {...clubHover.hoverProps}
          style={[styles.clubBanner, bgFloodlitPanel]}
        >
          <View style={styles.clubCopy}>
            <Text style={styles.clubKicker}>ATIMAR FOR CLUBS</Text>
            <Text style={styles.clubTitle}>La tua struttura merita più campo.</Text>
            <Text style={styles.clubText}>
              Porta strutture e disponibilità davanti agli sportivi della tua zona.
            </Text>
          </View>
          <View
            style={[
              styles.clubCta,
              webTransition("transform, box-shadow", 200),
              clubHover.hovered && styles.clubCtaHover,
            ]}
          >
            <Text style={styles.clubCtaText}>Scopri di più</Text>
            <Icon name="arrow-forward" size={18} color="ink" />
          </View>
        </Pressable>
      </ResponsiveContainer>
      {process.env.EXPO_OS === "web" && (
        <View style={{ marginTop: theme.spacing.xl }}>
          <WebFooter />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  heroBg: {
    width: "100%",
    backgroundColor: theme.colors.ink,
  },
  page: {
    gap: 64,
    paddingTop: 64,
    paddingBottom: 64,
  },
  hero: {
    gap: theme.spacing.xxl,
  },
  heroDesktop: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: theme.spacing.xxl,
  },
  heroCopy: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  kicker: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.displayBold,
    fontSize: 11,
    letterSpacing: 1.8,
  },
  title: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.displayBold,
    fontSize: 42,
    lineHeight: 43,
    letterSpacing: -1.7,
  },
  titleDesktop: {
    fontSize: 62,
    lineHeight: 62,
    letterSpacing: -2.6,
  },
  titleAccent: {
    color: theme.colors.lime,
  },
  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 25,
    maxWidth: 520,
  },
  search: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    backgroundColor: theme.colors.surface,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 15,
    ...noNativeOutline,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.lime,
  },
  searchButtonHover: {
    transform: [{ translateY: -1 }],
  },
  sportsScroll: {
    // Un horizontal ScrollView senza altezza esplicita collassa a 0 su web
    // (min-height:auto di un overflow container vale 0): l'altezza va data qui.
    // flexShrink:0 evita che, essendo il figlio più "leggero" della colonna,
    // si schiacci per primo quando lo spazio disponibile è inferiore al
    // contenuto totale.
    height: 36,
    flexGrow: 0,
    flexShrink: 0,
  },
  sports: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.lg,
  },
  featured: {
    flex: 1,
  },
  featuredHover: {
    transform: [{ translateY: -4 }],
  },
  featuredMedia: {
    borderRadius: theme.radius.xl,
  },
  featuredLabel: {
    position: "absolute",
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    gap: 3,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(18,20,15,0.82)",
  },
  featuredKicker: {
    color: theme.colors.lime,
    fontFamily: theme.fonts.displayBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  featuredName: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.displayBold,
    fontSize: 22,
  },
  featuredMeta: {
    color: "rgba(255,255,255,0.68)",
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 13,
  },
  section: {
    gap: theme.spacing.xl,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  sectionKicker: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.displayBold,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.displayBold,
    fontSize: 30,
    letterSpacing: -0.8,
  },
  seeAll: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.lg,
  },
  // Colonna pulita su mobile: nessun flexWrap (che impedirebbe alle righe di
  // stirarsi a piena larghezza, facendo sforare le card oltre lo schermo).
  list: {
    flexDirection: "column",
    gap: theme.spacing.md,
  },
  gridItem: {
    width: "31.5%",
    minWidth: 280,
    flexGrow: 1,
  },
  // Larghezza definita: forza la CampoCard a riempire la riga così che il corpo
  // (flex:1, minWidth:0) comprima il testo invece di espandere la card.
  listItem: {
    width: "100%",
  },
  loader: {
    paddingVertical: theme.spacing.xxxl,
  },
  empty: {
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.xxxl,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
  },
  emptyText: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bodyMedium,
  },
  clubBanner: {
    marginTop: theme.spacing.xxxl,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.xl,
    padding: theme.spacing.xxl,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.ink,
  },
  clubCopy: {
    flex: 1,
    minWidth: 240,
    gap: theme.spacing.sm,
  },
  clubKicker: {
    color: theme.colors.lime,
    fontFamily: theme.fonts.displayBold,
    fontSize: 10,
    letterSpacing: 1.7,
  },
  clubTitle: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.displayBold,
    fontSize: 28,
    letterSpacing: -0.7,
  },
  clubText: {
    color: "rgba(255,255,255,0.65)",
    fontFamily: theme.fonts.bodyRegular,
    lineHeight: 22,
  },
  clubCta: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lime,
  },
  clubCtaHover: {
    transform: [{ translateY: -2 }],
    boxShadow: "0 14px 30px rgba(147,185,0,0.4)",
  },
  clubCtaText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodyBold,
  },
});
