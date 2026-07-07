import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { pluralize } from "@atimar/utils";
import {
  Button,
  Header,
  Icon,
  MapPreview,
  ScreenContainer,
  ScreenTitle,
  StepProgress,
  textStyle,
} from "@/ui";
import { useCampiInLista } from "@/data/hooks";
import { useUserLocation } from "@/data/use-user-location";

export default function ValueNear() {
  const router = useRouter();
  const { data: campi = [] } = useCampiInLista();
  const userLocation = useUserLocation();

  return (
    <ScreenContainer
      header={
        <Header
          right={
            <Pressable onPress={() => router.push("/setup/sports")} hitSlop={8}>
              <Text style={textStyle("caption", "muted")}>Salta</Text>
            </Pressable>
          }
        />
      }
      footer={
        <View style={styles.footer}>
          <StepProgress step={1} total={3} variant="dots" />
          <Button onPress={() => router.push("/onboarding/value-book")}>
            Continua
          </Button>
        </View>
      }
    >
      <View style={styles.body}>
        <ScreenTitle
          title="Campi vicino a te, in pochi secondi."
          subtitle="ATIMAR ti mostra i campi sportivi intorno a te, con distanza, prezzo e disponibilità."
          size="h1"
        />
        <MapPreview
          campi={campi}
          height={260}
          userLocation={userLocation.location}
          locationStatus={userLocation.status}
          onRequestLocation={userLocation.requestLocation}
        />
        <View style={styles.count}>
          <Icon name="location" size={theme.iconSizes.sm} color="primary" />
          <Text style={textStyle("caption", "text")}>
            {pluralize(campi.length, "campo disponibile", "campi disponibili")}
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    width: "100%",
    maxWidth: theme.layout.maxReading,
    alignSelf: "center",
  },
  footer: { gap: theme.spacing.md, alignItems: "center" },
  count: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    alignSelf: "center",
  },
});
