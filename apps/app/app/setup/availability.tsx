import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { theme } from "@/theme/tokens";
import { DAYS, TIMES } from "@atimar/data";
import type { DayLabel, TimeId } from "@atimar/types";
import {
  DayChip,
  FlowScreen,
  SectionTitle,
  TimeOfDayCard,
  useToggleSet,
} from "@/ui";
import { useAppState } from "@/state/AppState";

export default function AvailabilityStep() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isEdit = mode === "edit";
  const { prefs, setPrefs } = useAppState();
  const days = useToggleSet<DayLabel>(prefs.availability.days);
  const times = useToggleSet<TimeId>(prefs.availability.times);

  const canContinue = days.count > 0 && times.count > 0;

  const onContinue = () => {
    setPrefs({ availability: { days: days.values, times: times.values } });
    if (isEdit) {
      // Vedi nota in setup/sports.tsx: niente `router.back()` in edit, non
      // possiamo assumere una history in-app (refresh/deep-link sul web).
      router.replace("/profile");
    } else {
      router.push("/setup/summary");
    }
  };

  return (
    <FlowScreen
      title="Quando giochi di solito?"
      subtitle="Seleziona i giorni e le fasce orarie in cui sei disponibile."
      onBack={isEdit ? () => router.replace("/profile") : () => router.back()}
      step={isEdit ? undefined : 2}
      total={isEdit ? undefined : 3}
      primaryLabel={isEdit ? "Salva" : "Continua"}
      onPrimary={onContinue}
      primaryDisabled={!canContinue}
      bodyGap={theme.spacing.xxl}
    >
      <View style={styles.section}>
        <SectionTitle>Giorni</SectionTitle>
        <View style={styles.daysRow}>
          {DAYS.map((day) => (
            <DayChip
              key={day}
              label={day}
              active={days.has(day)}
              onPress={() => days.toggle(day)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Fasce orarie</SectionTitle>
        <View style={styles.grid}>
          {TIMES.map((t) => (
            <View key={t.id} style={styles.cell}>
              <TimeOfDayCard
                label={t.label}
                range={t.range}
                icon={t.icon}
                active={times.has(t.id)}
                onPress={() => times.toggle(t.id)}
              />
            </View>
          ))}
        </View>
      </View>
    </FlowScreen>
  );
}

const styles = StyleSheet.create({
  section: { gap: theme.spacing.md },
  daysRow: { flexDirection: "row", gap: theme.spacing.xs },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.md },
  cell: { width: "47.5%", flexGrow: 1 },
});
