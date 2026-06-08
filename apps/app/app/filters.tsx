import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { DEFAULT_FILTERS, getCourtListItems, sportLabel } from "@atimar/data";
import { filterCourts } from "@atimar/utils";
import type { Filters } from "@atimar/types";
import {
  Button,
  Header,
  RangeSlider,
  ScreenContainer,
  SectionTitle,
  SportChip,
  ToggleRow,
  textStyle,
} from "@/ui";
import { useAppState } from "@/state/AppState";

export default function FiltersModal() {
  const router = useRouter();
  const { filters, setFilters } = useAppState();
  const [draft, setDraft] = useState<Filters>(filters);

  const courts = useMemo(() => getCourtListItems(), []);
  const sports = useMemo(
    () => Array.from(new Set(courts.map((c) => c.sportId))),
    [courts],
  );
  const count = useMemo(
    () => filterCourts(courts, draft).length,
    [courts, draft],
  );

  const apply = () => {
    setFilters(draft);
    router.back();
  };

  return (
    <ScreenContainer
      safeTop
      header={
        <Header
          onBack={() => router.back()}
          title="Filtri"
          right={
            <Pressable onPress={() => setDraft(DEFAULT_FILTERS)} hitSlop={8}>
              <Text style={textStyle("caption", "primary")}>Reimposta</Text>
            </Pressable>
          }
        />
      }
      footer={
        <Button onPress={apply}>
          Applica · {count} {count === 1 ? "campo" : "campi"}
        </Button>
      }
    >
      <View style={styles.body}>
        <View style={styles.section}>
          <SectionTitle>Sport</SectionTitle>
          <View style={styles.chips}>
            <SportChip
              label="Tutti"
              active={draft.sport === "all"}
              onPress={() => setDraft((d) => ({ ...d, sport: "all" }))}
            />
            {sports.map((id) => (
              <SportChip
                key={id}
                label={sportLabel(id)}
                active={draft.sport === id}
                onPress={() => setDraft((d) => ({ ...d, sport: id }))}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <SectionTitle>Distanza massima</SectionTitle>
            <Text style={textStyle("caption", "primary")}>
              {draft.maxDistance} km
            </Text>
          </View>
          <RangeSlider
            value={draft.maxDistance}
            min={1}
            max={50}
            onChange={(v) => setDraft((d) => ({ ...d, maxDistance: v }))}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle>Disponibilità</SectionTitle>
          <ToggleRow
            label="Aperto ora"
            sub="Mostra solo i campi aperti adesso"
            icon="time-outline"
            value={draft.openOnly}
            onValueChange={(v) => setDraft((d) => ({ ...d, openOnly: v }))}
          />
          <ToggleRow
            label="Solo disponibili"
            sub="Nascondi i campi senza slot liberi"
            icon="checkmark-circle-outline"
            value={draft.onlyAvailable}
            onValueChange={(v) => setDraft((d) => ({ ...d, onlyAvailable: v }))}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { gap: theme.spacing.xxl, paddingTop: theme.spacing.sm },
  section: { gap: theme.spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
