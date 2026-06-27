import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { theme } from "@/theme/tokens";
import {
  Button,
  CampoCard,
  Icon,
  ScreenContainer,
  textStyle,
} from "@/ui";
import { useAppState } from "@/state/AppState";
import { useCampiInListaByIds } from "@/data/hooks";

export default function Favorites() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const desktop = width >= theme.breakpoints.desktop;
  const { preferiti, user, isPreferitoCampo, togglePreferitoCampo } = useAppState();

  const { data: favCampi = [] } = useCampiInListaByIds(preferiti.campoIds);

  const apriStruttura = (strutturaId: string) =>
    router.push({ pathname: "/struttura/[id]", params: { id: strutturaId } });

  return (
    <ScreenContainer>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={textStyle("h1App", "ink")}>Preferiti</Text>
          {favCampi.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={textStyle("small", "primary")}>{favCampi.length}</Text>
            </View>
          )}
        </View>

        {favCampi.length === 0 ? (
          <FavoritesEmptyState
            onExplore={() => router.push("/search")}
            requiresLogin={!user}
            onLogin={() => router.push("/auth/login")}
          />
        ) : (
          <View style={[styles.list, desktop && styles.grid]}>
            {favCampi.map((campo) => (
              <View key={campo.id} style={desktop ? styles.gridItem : undefined}>
                <CampoCard
                  campo={campo}
                  variant={desktop ? "large" : "compact"}
                  isFav={isPreferitoCampo(campo.id)}
                  onFav={() => void togglePreferitoCampo(campo.id)}
                  onPress={() => apriStruttura(campo.strutturaId)}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

interface EmptyProps {
  onExplore: () => void;
  requiresLogin?: boolean;
  onLogin?: () => void;
}

function FavoritesEmptyState({ onExplore, requiresLogin, onLogin }: EmptyProps) {
  return (
    <View style={empty.container}>
      <View style={empty.iconWrap}>
        <Icon name="heart-outline" size={36} color={theme.colors.subtle} />
      </View>
      <Text style={textStyle("sectionHead", "ink")}>Nessun campo salvato</Text>
      <Text style={[textStyle("body", "muted"), empty.desc]}>
        Esplora i campi e tocca il cuore per salvarli qui.
      </Text>
      {requiresLogin ? (
        <View style={empty.actions}>
          <Button onPress={onLogin} variant="primary">
            Accedi per salvare
          </Button>
          <Pressable onPress={onExplore} style={empty.ghost}>
            <Text style={textStyle("caption", "primary")}>Esplora campi</Text>
          </Pressable>
        </View>
      ) : (
        <Button onPress={onExplore} variant="lime">
          Esplora campi
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { gap: theme.spacing.lg, paddingTop: theme.spacing.sm },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  countBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.tints.blueTint,
  },
  list: { gap: theme.spacing.md },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.lg,
  },
  gridItem: {
    width: "31.5%",
    minWidth: 280,
    flexGrow: 1,
  },
});

const empty = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.chip,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  desc: {
    textAlign: "center",
    maxWidth: 280,
  },
  actions: { gap: theme.spacing.sm, width: "100%" },
  ghost: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
});
