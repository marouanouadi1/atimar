import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { theme } from "@/theme/tokens";
import { DAYS, TIMES } from "@atimar/data";
import type { DayLabel, TimeId } from "@atimar/types";
import {
  Button,
  DayChip,
  Header,
  ScreenContainer,
  ScreenTitle,
  SectionTitle,
  TimeOfDayCard,
  useToggleSet,
} from "@/ui";
import { useAppState } from "@/state/AppState";

export default function AvailabilityStep() {
  const router = useRouter();
  const { prefs, setPrefs } = useAppState();
  const days = useToggleSet<DayLabel>(prefs.availability.days);
  const times = useToggleSet<TimeId>(prefs.availability.times);

  const canContinue = days.count > 0 && times.count > 0;

  const onContinue = () => {
    setPrefs({ availability: { days: days.values, times: times.values } });
    router.push("/setup/summary");
  };

  return (
    <ScreenContainer
      header={<Header onBack={() => router.back()} step={3} total={4} />}
      footer={
        <Button onPress={onContinue} disabled={!canContinue}>
          Continua
        </Button>
      }
    >
      <View style={styles.body}>
        <ScreenTitle
          title="Quando giochi di solito?"
          subtitle="Seleziona i giorni e le fasce orarie in cui sei disponibile."
          size="h1"
        />

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
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: theme.spacing.xxl,
    paddingTop: theme.spacing.sm,
    width: "100%",
    maxWidth: theme.layout.maxReading,
    alignSelf: "center",
  },
  section: { gap: theme.spacing.md },
  daysRow: { flexDirection: "row", gap: theme.spacing.xs },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.md },
  cell: { width: "47.5%", flexGrow: 1 },
});
