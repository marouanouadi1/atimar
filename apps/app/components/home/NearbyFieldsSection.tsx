import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/theme/tokens";
import { CampoCard, textStyle } from "@/ui";
import { useCampiInLista } from "@/data/hooks";

/** Horizontal scroll of court cards, shown on the web homepage. */
export function NearbyFieldsSection() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data: allCampi = [], isLoading } = useCampiInLista();
  const campi = allCampi.slice(0, 8);
  const isDesktop = width >= theme.breakpoints.desktop;

  const apriStruttura = (strutturaId: string) =>
    router.push({ pathname: "/struttura/[id]", params: { id: strutturaId } });

  return (
    <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>SELEZIONATI</Text>
          <Text style={styles.heading}>Campi in evidenza</Text>
        </View>
        <Pressable
          onPress={() => router.push("/search")}
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <Text style={textStyle("caption", "primary")}>Vedi tutti →</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator
          style={styles.loader}
          color={theme.colors.primary}
        />
      ) : campi.length === 0 ? (
        <Text style={[textStyle("caption", "muted"), styles.empty]}>
          Nessun campo disponibile al momento.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            isDesktop && styles.scrollDesktop,
          ]}
        >
          {campi.map((campo) => (
            <CampoCard
              key={campo.id}
              campo={campo}
              variant="large"
              width={isDesktop ? 300 : 260}
              onPress={() => apriStruttura(campo.strutturaId)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.lg,
    paddingTop: 64,
    paddingBottom: theme.spacing.xxl,
  },
  sectionDesktop: {
    maxWidth: theme.layout.maxContent,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: theme.layout.screenPadDesktop,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: theme.layout.screenPadX,
    gap: theme.spacing.lg,
  },
  headerCopy: {
    gap: theme.spacing.xs,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.displayBold,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  heading: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.displayBold,
    fontSize: 28,
    letterSpacing: -0.8,
  },
  scroll: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.layout.screenPadX,
    paddingBottom: theme.spacing.sm,
  },
  scrollDesktop: {
    paddingHorizontal: 0,
  },
  loader: {
    paddingVertical: theme.spacing.xl,
  },
  empty: {
    paddingHorizontal: theme.layout.screenPadX,
    paddingVertical: theme.spacing.xl,
  },
});
