/**
 * ATIMAR design tokens.
 *
 * Single source of truth for colors, spacing, radius, shadows, typography,
 * icon sizes, layout, motion and component variant defaults.
 * Local to the Expo app. No hardcoded colors in screens — always read from here.
 *
 * Derived from DESIGN_TOKENS.md (design export).
 */

/* ------------------------------------------------------------------ *
 * Colors
 * ------------------------------------------------------------------ */

export const colors = {
  ink: "#12140F",
  text: "#252820",
  muted: "#666B60",
  subtle: "#8A9084",
  line: "#D9D8CF",
  surface: "#FFFEF7",
  primary: "#315CFF",
  primaryDark: "#1736B8",
  lime: "#D9FF43",
  limeDark: "#93B900",
  chip: "#E9E8DF",
  bg: "#F2F0E8",
  placeholder: "#C9C9BF",
  dark: "#252820",
  success: "#168B55",
  asphalt: "#12140F",
  bone: "#F2F0E8",
  volt: "#D9FF43",
  cobalt: "#315CFF",
  orange: "#FF6B35",
} as const;

/** Functional / semantic colors recurring inline in the prototype. */
export const semantic = {
  star: "#E6A600",
  starEmpty: "#D5D4CA",
  danger: "#C93F32",
  heart: "#EA4D5B",
  disabled: "#B8B9B0",
  toggleOff: "#C8C9C0",
} as const;

/** Alpha tints over brand colors, used for IconBadge / soft backgrounds. */
export const tints = {
  limeTint: "rgba(217,255,67,0.28)",
  limeTintSoft: "rgba(217,255,67,0.12)",
  blueTint: "rgba(49,92,255,0.11)",
  inkTint: "rgba(18,20,15,0.07)",
  successTint: "rgba(22,139,85,0.13)",
  heartTint: "rgba(234,77,91,0.12)",
} as const;

/**
 * Translucent surface overlays: `glass` for floating controls / blurred bars,
 * `scrim` for darkening imagery behind foreground content,
 * `*OnDark` for text / border tokens on ink/dark backgrounds.
 */
export const overlays = {
  glass: "rgba(255,254,247,0.92)",
  glassLine: "rgba(18,20,15,0.10)",
  scrim: "rgba(12,14,10,0.58)",
  scrimSoft: "rgba(12,14,10,0.24)",
  /** Muted/subtitle text on ink/dark backgrounds (hero, ClubsCta, etc.) */
  subtleOnDark: "rgba(255,255,255,0.68)",
  /** Secondary feature text on ink/dark backgrounds. */
  dimOnDark: "rgba(255,255,255,0.80)",
  /** Thin border on dark surfaces (photo frames, sport chips on dark). */
  borderOnDark: "rgba(255,255,255,0.16)",
  /** Sport chip border on dark hero section. */
  chipOnDark: "rgba(255,255,255,0.22)",
  /** Floating badge background over a photo. */
  photoBadgeBg: "rgba(18,20,15,0.78)",
} as const;

/** Recurring gradients (stops + angle). Consumers map to LinearGradient/CSS. */
export const gradients = {
  splash: {
    angle: 180,
    stops: ["#F2F0E8", "#E8E5D8", "#D9FF43"],
    locations: [0, 0.55, 1],
  },
  profileHeader: {
    angle: 155,
    stops: ["#12140F", "#20241A", "#315CFF"],
    locations: [0, 0.7, 1],
  },
  avatar: {
    angle: 135,
    stops: ["#315CFF", "#D9FF43"],
    locations: [0, 1],
  },
  heroWeb: {
    angle: 160,
    stops: ["#12140F", "#1B2016", "#253312"],
    locations: [0, 0.55, 1],
  },
} as const;

/* ------------------------------------------------------------------ *
 * Spacing  (xs 4 · sm 8 · md 12 · lg 16 · xl 20 · xxl 24 · xxxl 32)
 * ------------------------------------------------------------------ */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/* ------------------------------------------------------------------ *
 * Radius
 * ------------------------------------------------------------------ */

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 28,
  card: 18,
  hero: 24,
  pill: 999,
} as const;

/* ------------------------------------------------------------------ *
 * Shadows — React Native style objects + web box-shadow strings
 * ------------------------------------------------------------------ */

export interface NativeShadow {
  boxShadow: string;
}

export const shadows = {
  card: { boxShadow: "0 2px 0 rgba(18,20,15,0.10)" },
  pop: { boxShadow: "0 18px 48px rgba(18,20,15,0.14)" },
  cta: { boxShadow: "0 8px 24px rgba(49,92,255,0.24)" },
  lime: { boxShadow: "0 8px 22px rgba(147,185,0,0.25)" },
  sheet: { boxShadow: "0 -16px 44px rgba(18,20,15,0.18)" },
  floatBtn: { boxShadow: "0 8px 20px rgba(18,20,15,0.14)" },
} as const satisfies Record<string, NativeShadow>;

export const webShadows = {
  card: "0 2px 0 rgba(18,20,15,.10)",
  pop: "0 18px 48px rgba(18,20,15,.14)",
  cta: "0 8px 24px rgba(49,92,255,.24)",
  lime: "0 8px 22px rgba(147,185,0,.25)",
  sheet: "0 -16px 44px rgba(18,20,15,.18)",
  floatBtn: "0 8px 20px rgba(18,20,15,.14)",
} as const;

/* ------------------------------------------------------------------ *
 * Typography
 * ------------------------------------------------------------------ */

export const fonts = {
  sans: "Inter_400Regular",
  family: "Inter_400Regular",
  bodyRegular: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",
  bodyBold: "Inter_700Bold",
  displayMedium: "SpaceGrotesk_500Medium",
  displaySemiBold: "SpaceGrotesk_600SemiBold",
  displayBold: "SpaceGrotesk_700Bold",
} as const;

export type FontWeight = "400" | "500" | "600" | "700" | "800";

export interface TypeStyle {
  fontSize: number;
  fontWeight: FontWeight;
  letterSpacing: number;
  lineHeight: number;
}

export const typography = {
  display: {
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: -1.2,
    lineHeight: 44,
  },
  h1: { fontSize: 32, fontWeight: "700", letterSpacing: -0.9, lineHeight: 36 },
  h1App: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.7,
    lineHeight: 32,
  },
  h2: { fontSize: 24, fontWeight: "700", letterSpacing: -0.5, lineHeight: 29 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  sectionHead: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.34,
    lineHeight: 22,
  },
  bodyStrong: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.15,
    lineHeight: 20,
  },
  body: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: -0.07,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.065,
    lineHeight: 18,
  },
  small: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.06,
    lineHeight: 16,
  },
  micro: { fontSize: 11, fontWeight: "700", letterSpacing: 0, lineHeight: 14 },
  overline: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.96,
    lineHeight: 16,
  },
} as const satisfies Record<string, TypeStyle>;

/* ------------------------------------------------------------------ *
 * Icon sizes
 * ------------------------------------------------------------------ */

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 32,
  hero: 48,
} as const;

/** Default stroke widths for line icons. */
export const iconStroke = { default: 2, emphasis: 2.6 } as const;

/* ------------------------------------------------------------------ *
 * Layout
 * ------------------------------------------------------------------ */

export const layout = {
  screenPadX: 20,
  screenPadDesktop: 40,
  maxContent: 1280,
  maxReading: 720,
  maxForm: 480,
  tabBarHeight: 64,
  tabBarPadBottom: 22,
  ctaHeight: 56,
  ghostHeight: 48,
  inputHeight: 52,
  searchHeight: 48,
  iconButton: 40,
  headerTopOnboard: 56,
  headerTopApp: 52,
  heroHeight: 280,
  cardHeroHeight: 140,
} as const;

export const breakpoints = {
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

/* ------------------------------------------------------------------ *
 * z-index
 * ------------------------------------------------------------------ */

export const zIndex = {
  base: 0,
  header: 10,
  floating: 20,
  tabBar: 30,
  overlay: 40,
  sheet: 50,
  toast: 60,
} as const;

/* ------------------------------------------------------------------ *
 * Motion — durations (ms) + cubic-bezier control points
 * ------------------------------------------------------------------ */

export type Bezier = readonly [number, number, number, number];

export interface MotionToken {
  duration: number;
  easing: Bezier;
}

export const easing = {
  standard: [0.2, 0.7, 0.2, 1] as Bezier,
} as const;

export const motion = {
  screen: { duration: 320, easing: easing.standard },
  fadeUp: { duration: 360, easing: easing.standard },
  pop: { duration: 520, easing: easing.standard },
  tap: { duration: 190, easing: easing.standard },
  pulseRing: { duration: 1700, easing: easing.standard },
} as const satisfies Record<string, MotionToken>;

/** Stagger delays (ms) for entrance lists. */
export const stagger = [60, 120, 180, 240] as const;

/* ------------------------------------------------------------------ *
 * Component variant defaults (from prototype Tweaks panel — fixed here)
 * ------------------------------------------------------------------ */

export const variantDefaults = {
  progressStyle: "pill",
  sportCardStyle: "border",
  ctaVariant: "primary",
} as const;

/* ------------------------------------------------------------------ *
 * Sport colors — used for map pins / sport tags. Fallback: brandFallback.
 * (Kept in theme as it is a color concern; selector helper below.)
 * ------------------------------------------------------------------ */

export const sportColors: Record<string, string> = {
  padel: "#1FB6A6",
  tennis: "#F2A33C",
  calcio: "#2ECC71",
  calcio5: "#27AE60",
  calcio7: "#1E9E55",
  calcio8: "#16A085",
  basket: "#E8743B",
  pallavolo: "#6C5CE7",
  beachvolley: "#F6B93B",
  beachtennis: "#E58E26",
  pickleball: "#20BF6B",
  squash: "#8E44AD",
  badminton: "#00A8FF",
  tennistavolo: "#EB3B5A",
  nuoto: "#0FB9B1",
  running: "#FA8231",
  ciclismo: "#3867D6",
  crossfit: "#EB3B5A",
  palestra: "#D63031",
  yoga: "#00B894",
  arrampicata: "#FDCB6E",
  scherma: "#A29BFE",
  boxe: "#E17055",
  mma: "#D63031",
  judo: "#6C5CE7",
  karate: "#00CEC9",
  rugby: "#574B90",
  baseball: "#FDCB6E",
  softball: "#FD79A8",
  hockey: "#74B9FF",
  pattinaggio: "#81ECEC",
  golf: "#26A65B",
  freccette: "#55EFC4",
  biliardo: "#636E72",
  bowling: "#B2BEC3",
  ginnastica: "#FD79A8",
  atletica: "#FFEAA7",
};

export const brandFallback = "#6BA2E0";

/** Returns the brand color for a sport id, with a neutral fallback. */
export function sportColor(sportId: string): string {
  return sportColors[sportId] ?? brandFallback;
}

/* ------------------------------------------------------------------ *
 * Map marker — colore unico dei pin campo (non più per-sport).
 * Distinto dal blu "tua posizione" (colors.primary).
 * ------------------------------------------------------------------ */

export const mapMarker = {
  pin: "#E5484D",
  pinActive: "#B4231F",
  ring: "#FFFEF7",
} as const;

/* ------------------------------------------------------------------ *
 * Aggregate
 * ------------------------------------------------------------------ */

export const theme = {
  colors,
  semantic,
  tints,
  overlays,
  gradients,
  spacing,
  radius,
  shadows,
  webShadows,
  fonts,
  typography,
  iconSizes,
  iconStroke,
  layout,
  breakpoints,
  zIndex,
  easing,
  motion,
  stagger,
  variantDefaults,
  sportColors,
  mapMarker,
} as const;

export type Theme = typeof theme;
export type ColorToken = keyof typeof colors;
export type SemanticToken = keyof typeof semantic;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type ShadowToken = keyof typeof shadows;
export type TypographyToken = keyof typeof typography;
export type IconSizeToken = keyof typeof iconSizes;

export default theme;
