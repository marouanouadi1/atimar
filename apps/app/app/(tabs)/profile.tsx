import { useRouter } from "expo-router";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { useState } from "react";

import { theme, sportColor } from "@/theme/tokens";
import { sportLabel } from "@atimar/data";
import {
  Avatar,
  Button,
  DetailStat,
  FormInput,
  Icon,
  MenuList,
  ProfileMenuItem,
  ResponsiveContainer,
  SectionTitle,
  SportChip,
  textStyle,
} from "@/ui";
import { useAppState } from "@/state/AppState";
import { useInviteMutation, useSubmitFeedbackMutation } from "@/data/hooks";

const FEEDBACK_CATEGORIES = [
  { value: "generale", label: "Generale" },
  { value: "bug", label: "Bug" },
  { value: "idea", label: "Idea" },
] as const;

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, profileId, prefs, preferiti, logout } = useAppState();
  const feedbackMutation = useSubmitFeedbackMutation();
  const inviteMutation = useInviteMutation();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState("generale");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [inviteNotice, setInviteNotice] = useState<string | null>(null);

  const favCount = preferiti.campoIds.length;
  const version = Constants.expoConfig?.version ?? "1.0.0";
  const webGrad =
    process.env.EXPO_OS === "web"
      ? ({
          backgroundImage:
            "radial-gradient(circle at 78% 18%, rgba(217,255,67,.20), transparent 28%), linear-gradient(145deg, #12140F 0%, #20251A 100%)",
        } as object)
      : {};

  const onLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  const requireLogin = () => {
    if (profileId) return true;
    router.push("/auth/login");
    return false;
  };

  const openFeedback = () => {
    if (!requireLogin()) return;
    setFeedbackError(null);
    setFeedbackSent(false);
    setFeedbackOpen(true);
  };

  const submitFeedback = async () => {
    if (!profileId) {
      router.push("/auth/login");
      return;
    }

    const trimmed = feedbackMessage.trim();
    if (trimmed.length < 10) {
      setFeedbackError("Scrivi almeno 10 caratteri.");
      return;
    }

    setFeedbackError(null);
    try {
      await feedbackMutation.mutateAsync({
        profileId,
        categoria: feedbackCategory,
        messaggio: trimmed,
        emailContatto: user?.email,
        piattaforma: Platform.OS,
        versioneApp: version,
      });
      setFeedbackMessage("");
      setFeedbackSent(true);
    } catch {
      setFeedbackError("Non siamo riusciti a inviare il feedback. Riprova.");
    }
  };

  const shareInvite = async () => {
    if (!requireLogin() || !profileId) return;
    setInviteNotice(null);

    try {
      const invito = await inviteMutation.mutateAsync({ profileId });
      const text = "Unisciti ad ATIMAR e trova campi sportivi vicino a te.";

      if (
        Platform.OS === "web" &&
        typeof navigator !== "undefined" &&
        "share" in navigator
      ) {
        await navigator.share({
          title: "ATIMAR",
          text,
          url: invito.link,
        });
        setInviteNotice("Link invito pronto.");
        return;
      }

      if (
        Platform.OS === "web" &&
        typeof navigator !== "undefined" &&
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(invito.link);
        setInviteNotice("Link invito copiato negli appunti.");
        return;
      }

      if (Platform.OS === "web") {
        await Linking.openURL(invito.link);
        setInviteNotice("Link invito aperto.");
        return;
      }

      await Share.share({
        title: "ATIMAR",
        message: `${text} ${invito.link}`,
        url: invito.link,
      });
      setInviteNotice("Link invito pronto.");
    } catch {
      setInviteNotice("Non siamo riusciti a preparare l'invito. Riprova.");
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + theme.spacing.xxxl,
        }}
      >
        <View style={[styles.header, webGrad]}>
          <ResponsiveContainer
            style={[
              styles.headerInner,
              { paddingTop: insets.top + theme.spacing.xl },
            ]}
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
          </ResponsiveContainer>
        </View>

        <ResponsiveContainer style={styles.content}>
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
          </View>

          <View style={styles.section}>
            <SectionTitle>I tuoi sport</SectionTitle>
            <View style={styles.sportChips}>
              {prefs.sports.length > 0 ? (
                prefs.sports.map((id) => {
                  const accent = sportColor(id);
                  return (
                    <SportChip
                      key={id}
                      label={sportLabel(id)}
                      active
                      style={{
                        backgroundColor: accent + "18",
                        borderColor: accent + "44",
                      }}
                    />
                  );
                })
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
                onPress={() => router.push("/setup/sports?mode=edit")}
              />
              <ProfileMenuItem
                icon="time-outline"
                label="Disponibilità"
                onPress={() => router.push("/setup/availability?mode=edit")}
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
                onPress={openFeedback}
              />
              <ProfileMenuItem
                icon="gift-outline"
                label="Invita amici"
                sub={inviteNotice ?? undefined}
                onPress={shareInvite}
                last
              />
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
        </ResponsiveContainer>
      </ScrollView>

      <Modal
        visible={feedbackOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFeedbackOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.feedbackSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={textStyle("title", "ink")}>Invia feedback</Text>
                <Text style={textStyle("caption", "muted")}>
                  Raccontaci cosa migliorare.
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setFeedbackOpen(false)}
              >
                <Icon
                  name="close"
                  size={theme.iconSizes.lg}
                  color="muted"
                />
              </Pressable>
            </View>

            <View style={styles.categoryRow}>
              {FEEDBACK_CATEGORIES.map((category) => {
                const active = feedbackCategory === category.value;
                return (
                  <Pressable
                    key={category.value}
                    onPress={() => setFeedbackCategory(category.value)}
                    style={[
                      styles.categoryPill,
                      active && styles.categoryPillActive,
                    ]}
                  >
                    <Text
                      style={textStyle(
                        "caption",
                        active ? "ink" : "muted"
                      )}
                    >
                      {category.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <FormInput
              value={feedbackMessage}
              onChangeText={(value) => {
                setFeedbackMessage(value);
                if (feedbackError) setFeedbackError(null);
                if (feedbackSent) setFeedbackSent(false);
              }}
              placeholder="Scrivi qui il tuo feedback..."
              multiline
            />

            {feedbackError ? (
              <Text style={textStyle("caption", "danger")}>
                {feedbackError}
              </Text>
            ) : null}
            {feedbackSent ? (
              <Text style={textStyle("caption", "primary")}>
                Grazie, feedback inviato.
              </Text>
            ) : null}

            <View style={styles.modalActions}>
              <Button
                variant="ghost"
                fullWidth={false}
                onPress={() => setFeedbackOpen(false)}
              >
                Chiudi
              </Button>
              <Button
                fullWidth={false}
                loading={feedbackMutation.isPending}
                disabled={feedbackMutation.isPending}
                onPress={submitFeedback}
              >
                Invia
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    backgroundColor: theme.colors.ink,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
  },
  headerInner: {
    alignItems: "center",
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  headerInfo: { alignItems: "center", gap: 2 },
  content: {
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.xxl,
    maxWidth: 900,
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
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
    backgroundColor: "rgba(18,20,15,0.48)",
  },
  feedbackSheet: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    ...theme.shadows.card,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  categoryPill: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.chip,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  categoryPillActive: {
    backgroundColor: theme.tints.limeTint,
    borderColor: theme.colors.lime,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: theme.spacing.sm,
  },
});
