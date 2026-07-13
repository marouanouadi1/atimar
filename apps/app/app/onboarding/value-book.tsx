import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import {
  Button,
  CampoCard,
  Header,
  ScreenContainer,
  ScreenTitle,
  StepProgress,
  textStyle,
} from "@/ui";
import { campiPubblici } from "@atimar/utils";
import { useCampiInLista } from "@/data/hooks";

export default function ValueBook() {
  const router = useRouter();
  const { data: campiAll = [] } = useCampiInLista();
  // Nessun toggle "aperto al pubblico" in onboarding: si mostra solo un
  // campo del catalogo pubblico, coerente col default della ricerca.
  const campo = campiPubblici(campiAll)[0];

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
          subtitle="Trovi il campo, scegli l'orario e invii la richiesta. Niente telefonate, niente attese."
          size="h1"
        />
        {campo ? <CampoCard campo={campo} variant="large" /> : null}
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
  body: {
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    width: "100%",
    maxWidth: theme.layout.maxReading,
    alignSelf: "center",
  },
  footer: { gap: theme.spacing.md, alignItems: "center" },
});
