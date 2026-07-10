import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/theme/tokens";
import { sportLabel } from "@atimar/data";
import { formatPrice, formatRating, pluralize } from "@atimar/utils";
import type { Recensione, Struttura, Campo } from "@atimar/types";
import {
  AvailabilityBadge,
  Button,
  CampoHero,
  Card,
  DetailStat,
  Divider,
  FilterChip,
  FormInput,
  Icon,
  IconButton,
  RatingBadge,
  SectionTitle,
  SportTag,
  textStyle,
} from "@/ui";
import { useAppState } from "@/state/AppState";
import {
  useStruttura,
  useCampiByStruttura,
  useRecensioni,
  useSubmitRecensioneMutation,
} from "@/data/hooks";
import type { SubmitRecensioneInput } from "@/data/hooks";

type Tab = "info" | "campi" | "recensioni";

export default function StrutturaDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const desktop = width >= theme.breakpoints.desktop;
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isPreferitoCampo, togglePreferitoCampo, user, profileId } = useAppState();
  const [tab, setTab] = useState<Tab>("info");

  const { data: struttura, isLoading } = useStruttura(id ?? "");
  const { data: campi = [] } = useCampiByStruttura(id ?? "");
  const { data: recensioni = [] } = useRecensioni(id ?? "");
  const submitRecensione = useSubmitRecensioneMutation();

  if (isLoading) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top + theme.spacing.xxxl }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!struttura) {
    return (
      <View
        style={[
          styles.missing,
          { paddingTop: insets.top + theme.spacing.xxxl },
        ]}
      >
        <Text style={textStyle("title", "ink")}>Struttura non trovata</Text>
        <Button variant="ghost" onPress={() => router.back()}>
          Torna indietro
        </Button>
      </View>
    );
  }

  const targetPrenotazione = struttura.linkPrenotazione ?? struttura.linkSitoWeb;
  const apriPrenotazione = () => {
    if (targetPrenotazione) {
      void Linking.openURL(targetPrenotazione);
    } else if (struttura.telefono) {
      void Linking.openURL(`tel:${struttura.telefono}`);
    }
  };
  const haAzionePrenotazione = Boolean(targetPrenotazione ?? struttura.telefono);

  const onTogglePreferitoCampo = (campoId: string) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    void togglePreferitoCampo(campoId);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + theme.spacing.xxxl,
        }}
      >
        {/* Hero */}
        <View style={[styles.heroWrap, desktop && styles.heroWrapDesktop]}>
          <CampoHero
            tipoHero={struttura.tipoHero}
            idSport={struttura.idSport[0] ?? "padel"}
            photoUrl={struttura.urlFotoCopertina}
            height={desktop ? 460 : 300}
            rounded={desktop}
          />
          <View
            style={[styles.heroControls, { top: insets.top + theme.spacing.sm }]}
          >
            <IconButton
              name="chevron-back"
              tone="glass"
              onPress={() => router.back()}
              accessibilityLabel="Indietro"
            />
          </View>
        </View>

        {/* Scheda dettaglio sovrapposta all'hero */}
        <View style={[styles.bodyPad, desktop && styles.bodyPadDesktop]}>
          <Card style={styles.detailCard} elevated>
            <View style={styles.detailTop}>
              <SportTag
                label={sportLabel(struttura.idSport[0] ?? "")}
                sportId={struttura.idSport[0] ?? "padel"}
              />
              <AvailabilityBadge
                state={struttura.sempreAperto ? "open" : "closed"}
                label={struttura.sempreAperto ? "Aperto ora" : "Chiuso"}
              />
            </View>
            <Text style={textStyle("h2", "ink")}>{struttura.nome}</Text>
            <View style={styles.detailMeta}>
              <RatingBadge
                value={struttura.mediaVoti}
                count={struttura.numeroRecensioni}
                showCount
              />
              {struttura.distanza ? (
                <Text style={textStyle("caption", "muted")}>
                  · {struttura.distanza}
                </Text>
              ) : null}
            </View>
            <View style={styles.addressRow}>
              <Icon
                name="location-outline"
                size={theme.iconSizes.sm}
                color="subtle"
              />
              <Text style={textStyle("caption", "muted")}>{struttura.indirizzo}</Text>
            </View>
          </Card>

          {/* CTA prenotazione */}
          {haAzionePrenotazione && (
            <Button onPress={apriPrenotazione} variant="primary" icon>
              {struttura.linkPrenotazione
                ? "Prenota ora"
                : struttura.linkSitoWeb
                  ? "Visita il sito"
                  : "Chiama la struttura"}
            </Button>
          )}

          {/* Tab */}
          <View style={styles.tabs}>
            <FilterChip
              label="Info"
              variant="segment"
              active={tab === "info"}
              onPress={() => setTab("info")}
            />
            <FilterChip
              label="Campi"
              variant="segment"
              active={tab === "campi"}
              onPress={() => setTab("campi")}
            />
            <FilterChip
              label="Recensioni"
              variant="segment"
              active={tab === "recensioni"}
              onPress={() => setTab("recensioni")}
            />
          </View>

          {tab === "info" ? (
            <InfoTab struttura={struttura} numeroCampi={campi.length} />
          ) : tab === "campi" ? (
            <CampiTab
              campi={campi}
              isPreferitoCampo={isPreferitoCampo}
              onTogglePreferito={onTogglePreferitoCampo}
            />
          ) : (
            <RecensioniTab
              strutturaId={struttura.id}
              mediaVoti={struttura.mediaVoti}
              numeroRecensioni={struttura.numeroRecensioni}
              recensioni={recensioni}
              profileId={profileId}
              onLoginPress={() => router.push("/auth/login")}
              onSubmit={(input) => submitRecensione.mutateAsync(input)}
              isSubmitting={submitRecensione.isPending}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* -------------------------------- Tab Info -------------------------------- */

function InfoTab({
  struttura,
  numeroCampi,
}: {
  struttura: Struttura;
  numeroCampi: number;
}) {
  const copertoIcon =
    struttura.coperto === true
      ? "home-outline"
      : struttura.coperto === false
        ? "sunny-outline"
        : "help-circle-outline";
  const copertoLabel =
    struttura.coperto === true
      ? "Indoor"
      : struttura.coperto === false
        ? "Outdoor"
        : "Da verificare";

  return (
    <View style={styles.section}>
      <Text style={textStyle("body", "text")}>{struttura.descrizione}</Text>

      <View style={styles.statsRow}>
        <DetailStat
          icon="grid-outline"
          value={String(numeroCampi)}
          label="Campi"
        />
        {struttura.distanza ? (
          <DetailStat
            icon="navigate-outline"
            value={struttura.distanza}
            label="Distanza"
          />
        ) : null}
        <DetailStat
          icon={copertoIcon}
          value={copertoLabel}
          label="Tipo"
        />
        <DetailStat
          icon="star-outline"
          value={struttura.mediaVoti > 0 ? formatRating(struttura.mediaVoti) : "—"}
          label="Rating"
        />
      </View>

      {struttura.servizi.length > 0 && (
        <View style={styles.subsection}>
          <SectionTitle>Servizi</SectionTitle>
          <View style={styles.amenities}>
            {struttura.servizi.map((s) => (
              <View key={s} style={styles.amenityChip}>
                <Icon
                  name="checkmark-circle"
                  size={theme.iconSizes.sm}
                  color="success"
                />
                <Text style={textStyle("caption", "text")}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

/* ------------------------------- Tab Campi ------------------------------- */

function CampiTab({
  campi,
  isPreferitoCampo,
  onTogglePreferito,
}: {
  campi: Campo[];
  isPreferitoCampo: (id: string) => boolean;
  onTogglePreferito: (id: string) => void;
}) {
  return (
    <View style={styles.section}>
      {campi.map((campo) => (
        <Card key={campo.id} style={styles.campoRow}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={textStyle("bodyStrong", "ink")}>{campo.nome}</Text>
            <Text style={textStyle("caption", "muted")}>
              {campo.nomeSport}
              {campo.superficie ? ` · ${campo.superficie}` : ""}
            </Text>
          </View>
          <Text style={textStyle("bodyStrong", "primary")}>
            {formatPrice(campo.prezzoOrario)}
          </Text>
          <IconButton
            name={isPreferitoCampo(campo.id) ? "heart" : "heart-outline"}
            tone="plain"
            size={32}
            iconSize={theme.iconSizes.md}
            active={isPreferitoCampo(campo.id)}
            onPress={() => onTogglePreferito(campo.id)}
            accessibilityLabel="Preferito"
          />
        </Card>
      ))}
    </View>
  );
}

/* ----------------------------- Tab Recensioni ----------------------------- */

function RecensioniTab({
  strutturaId,
  mediaVoti,
  numeroRecensioni,
  recensioni,
  profileId,
  onLoginPress,
  onSubmit,
  isSubmitting,
}: {
  strutturaId: string;
  mediaVoti: number;
  numeroRecensioni: number;
  recensioni: Recensione[];
  profileId: string | null;
  onLoginPress: () => void;
  onSubmit: (input: SubmitRecensioneInput) => Promise<unknown>;
  isSubmitting: boolean;
}) {
  const recensioneUtente = profileId
    ? recensioni.find((r) => r.profileId === profileId)
    : undefined;
  const [stelle, setStelle] = useState(recensioneUtente?.stelle ?? 0);
  const [commento, setCommento] = useState(recensioneUtente?.commento ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setStelle(recensioneUtente?.stelle ?? 0);
    setCommento(recensioneUtente?.commento ?? "");
    setFormError(null);
  }, [
    profileId,
    strutturaId,
    recensioneUtente?.id,
    recensioneUtente?.stelle,
    recensioneUtente?.commento,
  ]);

  const handleSubmit = async () => {
    if (!profileId) {
      onLoginPress();
      return;
    }

    if (stelle < 1 || stelle > 5) {
      setFormError("Seleziona un voto da 1 a 5 stelle");
      return;
    }

    setFormError(null);
    try {
      await onSubmit({
        strutturaId,
        profileId,
        stelle,
        commento,
        recensioneId: recensioneUtente?.id,
      });
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Non siamo riusciti a salvare la recensione",
      );
    }
  };

  return (
    <View style={styles.section}>
      <Card style={styles.reviewSummary}>
        <Text style={styles.bigRating}>
          {mediaVoti > 0 ? formatRating(mediaVoti) : "—"}
        </Text>
        <View style={{ gap: 2 }}>
          {mediaVoti > 0 && <RatingBadge value={mediaVoti} />}
          <Text style={textStyle("caption", "muted")}>
            {pluralize(numeroRecensioni, "recensione", "recensioni")}
          </Text>
        </View>
      </Card>

      <Card style={styles.reviewForm}>
        <View style={styles.reviewFormHeader}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={textStyle("bodyStrong", "ink")}>
              {recensioneUtente ? "Modifica la tua recensione" : "Lascia una recensione"}
            </Text>
            <Text style={textStyle("caption", "muted")}>
              La tua esperienza aiuta gli altri atleti a scegliere meglio.
            </Text>
          </View>
        </View>

        {profileId ? (
          <>
            <View style={styles.starPicker}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityLabel={`${value} stelle`}
                  onPress={() => setStelle(value)}
                  style={({ pressed }) => [
                    styles.starButton,
                    pressed && styles.starButtonPressed,
                  ]}
                >
                  <Icon
                    name={value <= stelle ? "star" : "star-outline"}
                    size={theme.iconSizes.xl}
                    color={value <= stelle ? theme.semantic.star : "subtle"}
                  />
                </Pressable>
              ))}
            </View>
            <FormInput
              label="Commento"
              placeholder="Racconta com'è andata..."
              value={commento}
              onChangeText={setCommento}
              multiline
              numberOfLines={4}
              autoCapitalize="sentences"
            />
            {formError ? (
              <Text style={textStyle("small", "danger")}>{formError}</Text>
            ) : null}
            <Button
              onPress={handleSubmit}
              loading={isSubmitting}
              leadingIcon="star-outline"
            >
              {recensioneUtente ? "Aggiorna recensione" : "Pubblica recensione"}
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            onPress={onLoginPress}
            leadingIcon="log-in-outline"
          >
            Accedi per recensire
          </Button>
        )}
      </Card>

      {recensioni.length === 0 ? (
        <Text style={textStyle("caption", "muted")}>
          Ancora nessuna recensione.
        </Text>
      ) : (
        recensioni.map((r) => (
          <View key={r.id} style={styles.review}>
            <View style={styles.reviewHead}>
              <Text style={textStyle("bodyStrong", "ink")}>{r.nomeAutore}</Text>
              <Text style={textStyle("small", "subtle")}>{r.quando}</Text>
            </View>
            <RatingBadge value={r.stelle} />
            <Text style={textStyle("caption", "text")}>{r.commento}</Text>
            <Divider />
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  heroWrap: {
    width: "100%",
    alignSelf: "center",
  },
  heroWrapDesktop: {
    maxWidth: theme.layout.maxContent,
    paddingHorizontal: theme.layout.screenPadDesktop,
    paddingTop: theme.spacing.xl,
  },
  missing: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.bg,
  },
  heroControls: {
    position: "absolute",
    left: theme.layout.screenPadX,
    right: theme.layout.screenPadX,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bodyPad: {
    paddingHorizontal: theme.layout.screenPadX,
    gap: theme.spacing.lg,
    width: "100%",
    alignSelf: "center",
  },
  bodyPadDesktop: {
    maxWidth: 1000,
    paddingHorizontal: theme.layout.screenPadDesktop,
  },
  detailCard: {
    marginTop: -48,
    gap: theme.spacing.sm,
  },
  detailTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: theme.colors.chip,
    borderRadius: theme.radius.pill,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  section: { gap: theme.spacing.md },
  subsection: { gap: theme.spacing.sm },
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  amenities: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.tints.successTint,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  campoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  reviewSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.lg,
  },
  reviewForm: { gap: theme.spacing.md },
  reviewFormHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  starPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  starButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.chip,
  },
  starButtonPressed: { opacity: 0.72 },
  bigRating: {
    color: theme.colors.ink,
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1,
  },
  review: { gap: theme.spacing.xs },
  reviewHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
