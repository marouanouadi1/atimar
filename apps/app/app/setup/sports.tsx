import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View, useWindowDimensions } from "react-native";

import { theme } from "@/theme/tokens";
import { SPORTS } from "@atimar/data";
import { pluralize } from "@atimar/utils";
import {
  FlowScreen,
  InfoBanner,
  SearchBar,
  SportSelectCard,
  useToggleSet,
} from "@/ui";
import { useAppState } from "@/state/AppState";

export default function SportsStep() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isEdit = mode === "edit";
  const { prefs, setPrefs } = useAppState();
  const selected = useToggleSet<string>(prefs.sports);
  const [query, setQuery] = useState("");
  const { width } = useWindowDimensions();
  const isDesktop = width >= theme.breakpoints.desktop;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? SPORTS.filter((s) => s.label.toLowerCase().includes(q)) : SPORTS;
  }, [query]);

  const onContinue = () => {
    setPrefs({ sports: selected.values });
    if (isEdit) {
      // `router.back()` presume una history in-app: chi arriva qui via
      // refresh/deep-link (comune sul web) non ne ha, e finirebbe fuori
      // dal wizard invece che sul profilo. La modifica torna sempre lì.
      router.replace("/profile");
    } else {
      router.push("/setup/availability");
    }
  };

  return (
    <FlowScreen
      title="Quali sport pratichi?"
      subtitle="Scegli uno o più sport per ricevere consigli su misura."
      // Prima schermata del wizard first-run: nessun "indietro" (come l'ex
      // value-near). In modifica dal profilo, torna al profilo.
      onBack={isEdit ? () => router.replace("/profile") : undefined}
      step={isEdit ? undefined : 1}
      total={isEdit ? undefined : 3}
      primaryLabel={isEdit ? "Salva" : "Continua"}
      onPrimary={onContinue}
      primaryDisabled={selected.count === 0}
      bodyGap={theme.spacing.lg}
    >
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Cerca uno sport…"
      />
      {selected.count > 0 ? (
        <InfoBanner icon="checkmark-circle" tone="lime">
          {pluralize(selected.count, "sport selezionato", "sport selezionati")}
        </InfoBanner>
      ) : null}
      <View style={styles.grid}>
        {filtered.map((sport) => (
          <View
            key={sport.id}
            style={[styles.cell, isDesktop && styles.cellDesktop]}
          >
            <SportSelectCard
              label={sport.label}
              icon={sport.icon}
              active={selected.has(sport.id)}
              onPress={() => selected.toggle(sport.id)}
            />
          </View>
        ))}
      </View>
    </FlowScreen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.md },
  cell: { width: "47.5%", flexGrow: 1 },
  cellDesktop: { width: "23%" },
});
