import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { TIMES, sportLabel } from "@atimar/data";
import { Card, CheckBadge, FlowScreen, Icon, textStyle } from "@/ui";
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
  const availability = `${prefs.availability.days.join(", ") || "—"} · ${prefs.availability.times.map(timeLabel).join(", ") || "—"}`;

  return (
    <FlowScreen
      title="Tutto pronto!"
      onBack={() => router.back()}
      step={3}
      total={3}
      primaryLabel="Entra in ATIMAR"
      primaryVariant="lime"
      primaryIcon
      onPrimary={onEnter}
      secondaryLabel="Rivedi"
      onSecondary={() => router.push("/setup/sports")}
      bodyGap={theme.spacing.xxl}
    >
      <View style={styles.hero}>
        <CheckBadge />
        <Text style={[textStyle("body", "muted"), styles.heroSubtitle]}>
          Abbiamo personalizzato ATIMAR in base alle tue preferenze.
        </Text>
      </View>

      <View style={styles.rows}>
        <SummaryRow icon="tennisball-outline" label="Sport" value={sports} />
        <SummaryRow
          icon="time-outline"
          label="Disponibilità"
          value={availability}
        />
      </View>
    </FlowScreen>
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
  hero: { alignItems: "center", gap: theme.spacing.lg },
  heroSubtitle: { textAlign: "center" },
  rows: { gap: theme.spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
});
