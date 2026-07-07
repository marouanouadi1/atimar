import { useMemo, useState } from "react";
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
import { ordinaCampi } from "@atimar/utils";
import {
  CampoCard,
  Icon,
  MediaStruttura,
  ResponsiveContainer,
} from "@/ui";
import { useAppState } from "@/state/AppState";
import { useCampiInLista, useStrutture } from "@/data/hooks";

const QUICK_SPORTS = [
  { id: "all", label: "Tutti" },
  { id: "padel", label: "Padel" },
  { id: "tennis", label: "Tennis" },
  { id: "calcio5", label: "Calcio 5" },
  { id: "beachvolley", label: "Beach" },
] as const;

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const desktop = width >= theme.breakpoints.desktop;
  const { user, filtri, setFiltri, isPreferitoCampo, togglePreferitoCampo } = useAppState();
  const [query, setQuery] = useState("");

  const { data: campi = [], isLoading } = useCampiInLista();
  const { data: strutture = [] } = useStrutture();
  const popular = useMemo(() => ordinaCampi(campi, "voti").slice(0, 6), [campi]);
  const featured = strutture.find((s) => s.urlFotoCopertina) ?? strutture[0];

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
      contentContainerStyle={{
        paddingBottom: insets.bottom + theme.layout.tabBarHeight + theme.spacing.xxxl,
      }}
    >
      <ResponsiveContainer
        style={[
          styles.page,
          {
            paddingTop: desktop ? theme.spacing.xxxl : insets.top + theme.spacing.lg,
          },
        ]}
      >
        <View style={[styles.hero, desktop && styles.heroDesktop]}>
          <View style={styles.heroCopy}>
            <Text style={styles.kicker}>READY WHEN YOU ARE</Text>
            <Text style={[styles.title, desktop && styles.titleDesktop]}>
              Ciao {user?.name?.split(" ")[0] ?? "Atleta"},{"\n"}
              <Text style={styles.titleAccent}>dove giochiamo?</Text>
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
              <Pressable onPress={() => goSearch()} style={styles.searchButton}>
                <Icon name="arrow-forward" size={19} color="ink" />
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sports}
            >
              {QUICK_SPORTS.map((sport) => (
                <Pressable
                  key={sport.id}
                  onPress={() => goSearch(sport.id)}
                  style={[
                    styles.sport,
                    filtri.sport === sport.id && styles.sportActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sportText,
                      filtri.sport === sport.id && styles.sportTextActive,
                    ]}
                  >
                    {sport.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <Pressable
            onPress={() => featured && apriStruttura(featured.id)}
            style={styles.featured}
          >
            <MediaStruttura
              photoUrl={featured?.urlFotoCopertina}
              sportId={featured?.idSport[0]}
              height={desktop ? 420 : 250}
              style={styles.featuredMedia}
            >
              <View style={styles.featuredLabel}>
                <Text style={styles.featuredKicker}>IN EVIDENZA</Text>
                <Text style={styles.featuredName} numberOfLines={1}>
                  {featured?.nome ?? "Scopri le strutture Atimar"}
                </Text>
                <Text style={styles.featuredMeta}>
                  {featured?.prezzoDaLabel ?? "Esplora ora"}
                </Text>
              </View>
            </MediaStruttura>
          </Pressable>
        </View>

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
            <View style={[styles.grid, !desktop && styles.list]}>
              {popular.map((campo) => (
                <View key={campo.id} style={desktop ? styles.gridItem : undefined}>
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
          style={styles.clubBanner}
        >
          <View style={styles.clubCopy}>
            <Text style={styles.clubKicker}>ATIMAR FOR CLUBS</Text>
            <Text style={styles.clubTitle}>La tua struttura merita più campo.</Text>
            <Text style={styles.clubText}>
              Porta strutture e disponibilità davanti agli sportivi della tua zona.
            </Text>
          </View>
          <View style={styles.clubCta}>
            <Text style={styles.clubCtaText}>Scopri di più</Text>
            <Icon name="arrow-forward" size={18} color="ink" />
          </View>
        </Pressable>
      </ResponsiveContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  page: {
    gap: 64,
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
    color: theme.colors.ink,
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
    color: theme.colors.primary,
  },
  subtitle: {
    color: theme.colors.muted,
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
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.surface,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 15,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.lime,
  },
  sports: {
    gap: theme.spacing.sm,
  },
  sport: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  sportActive: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
  },
  sportText: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 13,
  },
  sportTextActive: {
    color: theme.colors.surface,
  },
  featured: {
    flex: 1,
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
  list: {
    flexDirection: "column",
  },
  gridItem: {
    width: "31.5%",
    minWidth: 280,
    flexGrow: 1,
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
  clubCtaText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodyBold,
  },
});
