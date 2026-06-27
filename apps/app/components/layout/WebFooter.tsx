import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/theme/tokens";
import { BrandMark } from "@/ui";

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

/** Full-width footer for the web homepage and web pages. Hidden on native. */
export function WebFooter() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  if (process.env.EXPO_OS !== "web") return null;

  const isDesktop = width >= theme.breakpoints.tablet;

  return (
    <View style={styles.footer}>
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
                  <Pressable
                    key={link.label}
                    onPress={() => router.push(link.route as never)}
                    style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }]}
                  >
                    <Text style={styles.linkText}>{link.label}</Text>
                  </Pressable>
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
  },
  linkText: {
    color: theme.colors.subtle,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
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
