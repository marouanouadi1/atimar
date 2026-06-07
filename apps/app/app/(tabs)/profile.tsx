import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";

import { theme } from "@/theme/tokens";
import { sportLabel } from "@atimar/data";
import {
  Avatar,
  DetailStat,
  Icon,
  MenuList,
  ProfileMenuItem,
  SectionTitle,
  SportChip,
  textStyle,
} from "@/ui";
import { useAppState } from "@/state/AppState";

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, prefs, favorites, logout } = useAppState();

  const favCount = favorites.courtIds.length + favorites.venueIds.length;
  const version = Constants.expoConfig?.version ?? "1.0.0";

  const onLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + theme.spacing.xxxl,
        }}
      >
        <View
          style={[styles.header, { paddingTop: insets.top + theme.spacing.lg }]}
        >
          <Avatar name={user?.name ?? "Atleta"} size={72} variant="lime" />
          <View style={styles.headerInfo}>
            <Text style={textStyle("title", "surface")}>
              {user?.name ?? "Atleta"}
            </Text>
            <Text style={textStyle("caption", "placeholder")}>
              {user?.email ?? "—"}
            </Text>
          </View>
          <Pressable
            style={styles.editBtn}
            onPress={() => router.push("/setup/sports")}
          >
            <Icon
              name="create-outline"
              size={theme.iconSizes.sm}
              color="surface"
            />
            <Text style={textStyle("caption", "surface")}>Modifica</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.stats}>
            <DetailStat
              icon="tennisball-outline"
              value={String(prefs.sports.length)}
              label="Sport"
            />
            <DetailStat
              icon="heart-outline"
              value={String(favCount)}
              label="Preferiti"
            />
            <DetailStat
              icon="navigate-outline"
              value={`${prefs.area.radius}km`}
              label="Raggio"
            />
          </View>

          <View style={styles.section}>
            <SectionTitle>I tuoi sport</SectionTitle>
            <View style={styles.sportChips}>
              {prefs.sports.length > 0 ? (
                prefs.sports.map((id) => (
                  <SportChip key={id} label={sportLabel(id)} active />
                ))
              ) : (
                <Text style={textStyle("caption", "muted")}>
                  Nessuno sport selezionato
                </Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <SectionTitle>Preferenze</SectionTitle>
            <MenuList>
              <ProfileMenuItem
                icon="tennisball-outline"
                label="Sport preferiti"
                sub={`${prefs.sports.length} selezionati`}
                onPress={() => router.push("/setup/sports")}
              />
              <ProfileMenuItem
                icon="location-outline"
                label="Zona"
                sub={prefs.area.location}
                onPress={() => router.push("/setup/area")}
              />
              <ProfileMenuItem
                icon="time-outline"
                label="Disponibilità"
                onPress={() => router.push("/setup/availability")}
              />
              <ProfileMenuItem
                icon="notifications-outline"
                label="Notifiche"
                last
              />
            </MenuList>
          </View>

          <View style={styles.section}>
            <SectionTitle>Account</SectionTitle>
            <MenuList>
              <ProfileMenuItem
                icon="heart-outline"
                label="Preferiti"
                badge={favCount > 0 ? String(favCount) : undefined}
                onPress={() => router.push("/favorites")}
              />
              <ProfileMenuItem
                icon="chatbubble-ellipses-outline"
                label="Invia feedback"
              />
              <ProfileMenuItem icon="gift-outline" label="Invita amici" last />
            </MenuList>
          </View>

          <View style={styles.section}>
            <SectionTitle>Supporto</SectionTitle>
            <MenuList>
              <ProfileMenuItem
                icon="help-circle-outline"
                label="Centro assistenza"
              />
              <ProfileMenuItem
                icon="shield-checkmark-outline"
                label="Privacy"
                last
              />
            </MenuList>
          </View>

          <Pressable style={styles.logout} onPress={onLogout}>
            <Icon
              name="log-out-outline"
              size={theme.iconSizes.md}
              color="danger"
            />
            <Text style={textStyle("bodyStrong", "danger")}>
              Esci dall’account
            </Text>
          </Pressable>

          <Text style={[textStyle("small", "subtle"), styles.version]}>
            ATIMAR · v{version}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.layout.screenPadX,
    paddingBottom: theme.spacing.xl,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    alignItems: "center",
    gap: theme.spacing.md,
  },
  headerInfo: { alignItems: "center", gap: 2 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryDark,
  },
  content: {
    paddingHorizontal: theme.layout.screenPadX,
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.xxl,
  },
  stats: { flexDirection: "row", gap: theme.spacing.md },
  section: { gap: theme.spacing.md },
  sportChips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.tints.heartTint,
  },
  version: { textAlign: "center" },
});
