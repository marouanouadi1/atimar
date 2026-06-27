import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { theme } from "@/theme/tokens";
import { SPORTS } from "@atimar/data";
import { pluralize } from "@atimar/utils";
import {
  Button,
  Header,
  InfoBanner,
  ScreenContainer,
  ScreenTitle,
  SearchBar,
  SportSelectCard,
  useToggleSet,
} from "@/ui";
import { useAppState } from "@/state/AppState";

export default function SportsStep() {
  const router = useRouter();
  const { prefs, setPrefs } = useAppState();
  const selected = useToggleSet<string>(prefs.sports);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? SPORTS.filter((s) => s.label.toLowerCase().includes(q)) : SPORTS;
  }, [query]);

  const onContinue = () => {
    setPrefs({ sports: selected.values });
    router.push("/setup/area");
  };

  return (
    <ScreenContainer
      header={<Header onBack={() => router.back()} step={1} total={4} />}
      footer={
        <Button onPress={onContinue} disabled={selected.count === 0}>
          Continua
        </Button>
      }
    >
      <View style={styles.body}>
        <ScreenTitle
          title="Quali sport pratichi?"
          subtitle="Scegli uno o più sport per ricevere consigli su misura."
          size="h1"
        />
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Cerca uno sport…"
        />
        {selected.count > 0 ? (
          <InfoBanner icon="checkmark-circle" tone="lime">
            {pluralize(
              selected.count,
              "sport selezionato",
              "sport selezionati",
            )}
          </InfoBanner>
        ) : null}
        <View style={styles.grid}>
          {filtered.map((sport) => (
            <View key={sport.id} style={styles.cell}>
              <SportSelectCard
                label={sport.label}
                icon={sport.icon}
                active={selected.has(sport.id)}
                onPress={() => selected.toggle(sport.id)}
              />
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    width: "100%",
    maxWidth: theme.layout.maxReading,
    alignSelf: "center",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.md },
  cell: { width: "47.5%", flexGrow: 1 },
});
