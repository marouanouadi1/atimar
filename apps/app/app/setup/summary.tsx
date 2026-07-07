import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { TIMES, sportLabel } from "@atimar/data";
import {
  Button,
  Card,
  CheckBadge,
  Header,
  Icon,
  ScreenContainer,
  ScreenTitle,
  textStyle,
} from "@/ui";
import { useAppState } from "@/state/AppState";

function timeLabel(id: string): string {
  return TIMES.find((t) => t.id === id)?.label ?? id;
}

export default function Summary() {
  const router = useRouter();
  const { prefs, completeOnboarding, user } = useAppState();

  const onEnter = () => {
    completeOnboarding();
    router.replace(user ? "/home" : "/auth/register");
  };

  const sports = prefs.sports.map(sportLabel).join(", ") || "—";
  const zone = `${prefs.area.location} · ${prefs.area.radius} km`;
  const availability = `${prefs.availability.days.join(", ") || "—"} · ${prefs.availability.times.map(timeLabel).join(", ") || "—"}`;

  return (
    <ScreenContainer
      header={<Header onBack={() => router.back()} />}
      footer={
        <View style={styles.footer}>
          <Button variant="lime" icon onPress={onEnter}>
            Entra in ATIMAR
          </Button>
          <Button variant="ghost" onPress={() => router.push("/setup/sports")}>
            Modifica preferenze
          </Button>
        </View>
      }
    >
      <View style={styles.body}>
        <View style={styles.hero}>
          <CheckBadge />
          <ScreenTitle
            title="Tutto pronto!"
            subtitle="Abbiamo personalizzato ATIMAR in base alle tue preferenze."
            size="h1"
            align="center"
          />
        </View>

        <View style={styles.rows}>
          <SummaryRow icon="tennisball-outline" label="Sport" value={sports} />
          <SummaryRow icon="location-outline" label="Zona" value={zone} />
          <SummaryRow
            icon="time-outline"
            label="Disponibilità"
            value={availability}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <Card style={styles.row}>
      <Icon name={icon} size={theme.iconSizes.lg} color="primary" />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={textStyle("caption", "subtle")}>{label}</Text>
        <Text style={textStyle("bodyStrong", "ink")}>{value}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: theme.spacing.xxl,
    paddingTop: theme.spacing.lg,
    width: "100%",
    maxWidth: theme.layout.maxReading,
    alignSelf: "center",
  },
  hero: { alignItems: "center", gap: theme.spacing.lg },
  rows: { gap: theme.spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  footer: { gap: theme.spacing.sm },
});
