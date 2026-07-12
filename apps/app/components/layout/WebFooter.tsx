import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/theme/tokens";
import { BrandMark, bgFloodlitFooter, useHover, webTransition } from "@/ui";

const COLUMNS: {
  title: string;
  links: { label: string; route: string }[];
}[] = [
  {
    title: "Prodotto",
    links: [
      { label: "Cerca campi", route: "/search" },
      { label: "Strutture sportive", route: "/gestori" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Accedi", route: "/auth/login" },
      { label: "Registrati", route: "/auth/register" },
    ],
  },
];

/** Footer link with a hover brighten (web). */
function FooterLink({ label, onPress }: { label: string; onPress: () => void }) {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable onPress={onPress} {...hoverProps} style={styles.link}>
      <Text style={[styles.linkText, webTransition("color", 150), hovered && styles.linkTextHover]}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Full-width footer for the web homepage and web pages. Hidden on native. */
export function WebFooter() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  if (process.env.EXPO_OS !== "web") return null;

  // Soglia mobile↔desktop unica (1024) coerente con le altre sezioni web.
  const isDesktop = width >= theme.breakpoints.desktop;

  return (
    <View style={[styles.footer, bgFloodlitFooter, { width: "100%" }]}>
      <View style={[styles.inner, isDesktop && styles.innerDesktop]}>
        {/* Brand */}
        <View style={styles.brand}>
          <BrandMark inverse size={38} />
          <Text style={styles.tagline}>
            La piattaforma sportiva per trovare e prenotare campi.
          </Text>
        </View>

        {/* Link columns */}
        {isDesktop && (
          <View style={styles.columns}>
            {COLUMNS.map((col) => (
              <View key={col.title} style={styles.column}>
                <Text style={styles.colTitle}>{col.title}</Text>
                {col.links.map((link) => (
                  <FooterLink
                    key={link.label}
                    label={link.label}
                    onPress={() => router.push(link.route as never)}
                  />
                ))}
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        <View style={[styles.bottomInner, isDesktop && styles.bottomInnerDesktop]}>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} ATIMAR. Tutti i diritti riservati.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: theme.colors.ink,
  },
  inner: {
    maxWidth: theme.layout.maxContent,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: theme.layout.screenPadDesktop,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.xxxl,
  },
  innerDesktop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 56,
    paddingBottom: theme.spacing.xxxl,
  },
  brand: {
    gap: theme.spacing.md,
    maxWidth: 300,
  },
  tagline: {
    color: theme.colors.subtle,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
  },
  columns: {
    flexDirection: "row",
    gap: 64,
  },
  column: {
    gap: theme.spacing.md,
  },
  colTitle: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: theme.spacing.xs,
  },
  link: {
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  linkText: {
    color: theme.colors.subtle,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
  },
  linkTextHover: {
    color: theme.colors.lime,
  },
  bottom: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.overlays.borderOnDark,
  },
  bottomInner: {
    maxWidth: theme.layout.maxContent,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: theme.layout.screenPadDesktop,
    paddingVertical: theme.spacing.xl,
  },
  bottomInnerDesktop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  copyright: {
    color: theme.colors.subtle,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 12,
  },
});
