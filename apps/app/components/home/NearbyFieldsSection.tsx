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
        <Text style={textStyle("sectionHead", "ink")}>Campi in evidenza</Text>
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
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.xl,
  },
  sectionDesktop: {
    maxWidth: theme.layout.maxContent,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: theme.layout.screenPadDesktop,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.layout.screenPadX,
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
  },
});
