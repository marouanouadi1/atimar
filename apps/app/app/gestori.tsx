import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/theme/tokens";
import { Icon, IconButton } from "@/ui";
import { WebHeader } from "@/components/layout/WebHeader";
import { WebFooter } from "@/components/layout/WebFooter";
import { supabase } from "@/data/client";

const FEATURES = [
  {
    icon: "megaphone-outline" as const,
    title: "Visibilità immediata",
    desc: "Raggiungi migliaia di sportivi che cercano campi nella tua zona ogni giorno.",
  },
  {
    icon: "calendar-outline" as const,
    title: "Scheda sempre chiara",
    desc: "Mostra campi, servizi, foto e contatti in modo ordinato e facile da consultare.",
  },
  {
    icon: "bar-chart-outline" as const,
    title: "Domanda più leggibile",
    desc: "Capisci quali sport attirano più interesse e quali dettagli contano davvero.",
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "Nessun costo iniziale",
    desc: "Registra la tua struttura gratuitamente. Paghi solo quando ottieni prenotazioni.",
  },
];

export default function Gestori() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= theme.breakpoints.desktop;
  const isWeb = process.env.EXPO_OS === "web";

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!nome.trim() || !email.trim()) return;
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const { error } = await (supabase as any)
        .from("Lead_Clubs")
        .insert({
          nome_struttura: nome.trim(),
          email: email.trim(),
          telefono: telefono.trim() || null,
        });
      // TODO: after creating Lead_Clubs in Supabase, run
      // `supabase gen types --local > packages/db-types/src/index.ts`
      // to remove the `as any` cast above.
      if (error) throw error;
      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Errore durante l'invio. Riprova."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const webGradient = isWeb
    ? ({
        backgroundImage:
          "radial-gradient(circle at 80% 16%, rgba(217,255,67,.20), transparent 28%), linear-gradient(145deg, #12140F 0%, #20251A 100%)",
      } as object)
    : {};

  return (
    <View style={[styles.root, { paddingTop: isWeb ? 0 : insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {isWeb && <WebHeader />}

        {!isWeb && (
          <View style={styles.mobileHeader}>
            <IconButton
              name="chevron-back"
              onPress={() => router.back()}
              accessibilityLabel="Indietro"
            />
          </View>
        )}

        {/* Hero */}
        <View style={[styles.hero, isDesktop && styles.heroDesktop, webGradient]}>
          <View style={[styles.heroContent, isDesktop && styles.heroContentDesktop]}>
            <View style={styles.badge}>
              <Icon name="business-outline" size={14} color={theme.colors.lime} />
              <Text style={styles.badgeText}>PER LE STRUTTURE SPORTIVE</Text>
            </View>

            <Text style={[styles.heroHeading, isDesktop && styles.heroHeadingDesktop]}>
              Porta la tua struttura{"\n"}
              <Text style={styles.heroLime}>su ATIMAR</Text>
            </Text>

            <Text style={styles.heroSub}>
              Crea una presenza curata per la tua struttura e fatti trovare dagli
              sportivi che stanno scegliendo dove giocare.
            </Text>
            <View style={styles.heroProof}>
              <View style={styles.proofItem}>
                <Text style={styles.proofValue}>0</Text>
                <Text style={styles.proofLabel}>costi iniziali</Text>
              </View>
              <View style={styles.proofItem}>
                <Text style={styles.proofValue}>24h</Text>
                <Text style={styles.proofLabel}>per il primo contatto</Text>
              </View>
              <View style={styles.proofItem}>
                <Text style={styles.proofValue}>Web</Text>
                <Text style={styles.proofLabel}>e app in un’unica vetrina</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Benefici */}
        <View style={[styles.features, isDesktop && styles.featuresDesktop]}>
          <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop]}>
            Perché scegliere ATIMAR
          </Text>
          <View style={[styles.featureGrid, isDesktop && styles.featureGridDesktop]}>
            {FEATURES.map((f) => (
              <View key={f.title} style={[styles.featureCard, isDesktop && styles.featureCardDesktop]}>
                <View style={styles.featureIconWrap}>
                  <Icon name={f.icon} size={22} color={theme.colors.primary} />
                </View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Form contatto */}
        <View style={[styles.formSection, isDesktop && styles.formSectionDesktop]}>
          <View style={styles.formIntro}>
            <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop]}>
              Raccontaci la tua struttura
            </Text>
            <Text style={styles.formIntroText}>
              Bastano pochi dati: li usiamo solo per ricontattarti e capire come
              presentare al meglio campi e servizi.
            </Text>
          </View>
          <View style={[styles.formCard, isDesktop && styles.formCardDesktop]}>
            {submitted ? (
              <View style={styles.successState}>
                <View style={styles.successIcon}>
                  <Icon name="checkmark-circle" size={40} color={theme.colors.success} />
                </View>
                <Text style={styles.successTitle}>Richiesta inviata!</Text>
                <Text style={styles.successSub}>
                  Il nostro team ti contatterà entro 24 ore per configurare la tua struttura.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.formTitle}>Inizia ora, è gratuito</Text>
                <Text style={styles.formSub}>
                  Compila il form e ti ricontatteremo entro 24 ore.
                </Text>

                <View style={styles.fields}>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Nome struttura *</Text>
                    <View style={styles.inputWrap}>
                      <Icon name="business-outline" size={16} color={theme.colors.subtle} />
                      <TextInput
                        style={styles.input}
                        placeholder="Es. Green Padel Center"
                        placeholderTextColor={theme.colors.subtle}
                        value={nome}
                        onChangeText={setNome}
                      />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Email *</Text>
                    <View style={styles.inputWrap}>
                      <Icon name="mail-outline" size={16} color={theme.colors.subtle} />
                      <TextInput
                        style={styles.input}
                        placeholder="info@miostruttura.com"
                        placeholderTextColor={theme.colors.subtle}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Telefono</Text>
                    <View style={styles.inputWrap}>
                      <Icon name="call-outline" size={16} color={theme.colors.subtle} />
                      <TextInput
                        style={styles.input}
                        placeholder="+39 02 1234567"
                        placeholderTextColor={theme.colors.subtle}
                        value={telefono}
                        onChangeText={setTelefono}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                </View>

                {submitError ? (
                  <Text style={styles.errorText}>{submitError}</Text>
                ) : null}
                <Pressable
                  onPress={() => void handleSubmit()}
                  style={({ pressed }) => [
                    styles.submitBtn,
                    (!nome || !email || submitLoading) && styles.submitBtnDisabled,
                    pressed && { opacity: 0.9 },
                  ]}
                  disabled={!nome || !email || submitLoading}
                >
                  {submitLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.ink} />
                  ) : (
                    <>
                      <Text style={styles.submitBtnText}>Invia richiesta</Text>
                      <Icon name="arrow-forward" size={18} color={theme.colors.ink} />
                    </>
                  )}
                </Pressable>
              </>
            )}
          </View>
        </View>

        {isWeb && <WebFooter />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { gap: 0 },
  mobileHeader: {
    paddingHorizontal: theme.layout.screenPadX,
    paddingVertical: theme.spacing.sm,
  },
  hero: {
    backgroundColor: theme.colors.ink,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 64,
  },
  heroDesktop: {
    paddingHorizontal: 80,
    paddingTop: 88,
    paddingBottom: 88,
  },
  heroContent: { gap: theme.spacing.xl },
  heroContentDesktop: { maxWidth: 640 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.lime,
    fontFamily: theme.fonts.displayBold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  heroHeading: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.displayBold,
    fontSize: 36,
    letterSpacing: -1,
    lineHeight: 44,
  },
  heroHeadingDesktop: {
    fontSize: 52,
    lineHeight: 62,
    letterSpacing: -1.5,
  },
  heroLime: { color: theme.colors.lime },
  heroSub: {
    color: theme.overlays.subtleOnDark,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 26,
  },
  heroProof: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  proofItem: {
    minWidth: 150,
    gap: 2,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.overlays.borderOnDark,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  proofValue: {
    color: theme.colors.lime,
    fontFamily: theme.fonts.displayBold,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  proofLabel: {
    color: theme.overlays.subtleOnDark,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
  },
  features: {
    paddingHorizontal: 24,
    paddingVertical: 56,
    gap: theme.spacing.xxl,
  },
  featuresDesktop: {
    maxWidth: 1240,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 80,
    paddingVertical: 88,
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.displayBold,
    fontSize: 24,
    letterSpacing: -0.6,
  },
  sectionTitleDesktop: {
    fontSize: 32,
    letterSpacing: -1,
  },
  featureGrid: {
    gap: theme.spacing.lg,
  },
  featureGridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xl,
  },
  featureCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.line,
    ...theme.shadows.card,
  },
  featureCardDesktop: {
    flexBasis: "45%",
    flexGrow: 1,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.tints.blueTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xs,
  },
  featureTitle: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 16,
    letterSpacing: -0.32,
  },
  featureDesc: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
  },
  formSection: {
    paddingHorizontal: 24,
    paddingVertical: 56,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.xxl,
  },
  formSectionDesktop: {
    paddingHorizontal: 80,
    paddingVertical: 88,
    alignItems: "center",
  },
  formIntro: {
    width: "100%",
    maxWidth: 560,
    gap: theme.spacing.sm,
  },
  formIntroText: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 15,
    lineHeight: 24,
  },
  formCard: {
    gap: theme.spacing.xl,
  },
  formCardDesktop: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.xl,
    padding: 40,
    borderWidth: 1,
    borderColor: theme.colors.line,
    ...theme.shadows.pop,
  },
  formTitle: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.displayBold,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  formSub: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
  },
  fields: { gap: theme.spacing.lg },
  fieldGroup: { gap: theme.spacing.sm },
  fieldLabel: {
    color: theme.colors.subtle,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    height: theme.layout.inputHeight,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
  },
  input: {
    flex: 1,
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: "500",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    height: theme.layout.ctaHeight,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lime,
    ...theme.shadows.lime,
    marginTop: theme.spacing.sm,
  },
  submitBtnDisabled: {
    backgroundColor: theme.colors.placeholder,
    ...theme.shadows.card,
  },
  errorText: {
    color: theme.semantic.danger,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  submitBtnText: {
    color: theme.colors.ink,
    fontSize: 15,
    fontWeight: "700",
  },
  successState: {
    alignItems: "center",
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.xxxl,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.tints.successTint,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    color: theme.colors.ink,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  successSub: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 320,
  },
});
