import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { getCourtListItems } from "@atimar/data";
import {
  Button,
  CourtCard,
  Header,
  ScreenContainer,
  ScreenTitle,
  StepProgress,
  textStyle,
} from "@/ui";

export default function ValueBook() {
  const router = useRouter();
  const court = getCourtListItems()[0];

  return (
    <ScreenContainer
      header={
        <Header
          onBack={() => router.back()}
          right={
            <Pressable
              onPress={() => router.push("/onboarding/intro")}
              hitSlop={8}
            >
              <Text style={textStyle("caption", "muted")}>Salta</Text>
            </Pressable>
          }
        />
      }
      footer={
        <View style={styles.footer}>
          <StepProgress step={2} total={3} variant="dots" />
          <Button onPress={() => router.push("/onboarding/intro")}>
            Continua
          </Button>
        </View>
      }
    >
      <View style={styles.body}>
        <ScreenTitle
          title="Richiedi disponibilità in un tocco."
          subtitle="Trovi il campo, scegli l’orario e invii la richiesta. Niente telefonate, niente attese."
          size="h1"
        />
        {court ? <CourtCard court={court} variant="large" /> : null}
        <Button
          variant="lime"
          icon
          onPress={() => router.push("/onboarding/intro")}
        >
          Richiedi disponibilità
        </Button>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { gap: theme.spacing.xl, paddingTop: theme.spacing.lg },
  footer: { gap: theme.spacing.md, alignItems: "center" },
});
