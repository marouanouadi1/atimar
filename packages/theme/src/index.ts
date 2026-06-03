/**
 * ATIMAR — Design Tokens (@atimar/theme)
 *
 * Single source of truth for colors, spacing, radius, shadows, typography,
 * icon sizes, layout, motion and component variant defaults.
 * Framework-agnostic TypeScript: consumed by apps/mobile (React Native) and
 * apps/web (Next.js). No hardcoded colors in screens — always read from here.
 *
 * Derived from DESIGN_TOKENS.md (design export).
 */

/* ------------------------------------------------------------------ *
 * Colors
 * ------------------------------------------------------------------ */

export const colors = {
  ink: '#071A3D',
  text: '#13213C',
  muted: '#6B7280',
  subtle: '#8A94A6',
  line: '#E8EDF5',
  surface: '#FFFFFF',
  primary: '#006EF5',
  primaryDark: '#0058CC',
  lime: '#C8FF00',
  limeDark: '#98C600',
  chip: '#F1F5FA',
  bg: '#F7F9FC',
  placeholder: '#DDE5EF',
  dark: '#20334F',
  success: '#24B26B',
} as const;

/** Functional / semantic colors recurring inline in the prototype. */
export const semantic = {
  star: '#F5B400',
  starEmpty: '#E0E5EE',
  danger: '#C0392B',
  heart: '#EE5555',
  disabled: '#C7D3E3',
  toggleOff: '#D5DDE8',
} as const;

/** Alpha tints over brand colors, used for IconBadge / soft backgrounds. */
export const tints = {
  limeTint: 'rgba(200,255,0,0.16)',
  limeTintSoft: 'rgba(200,255,0,0.07)',
  blueTint: 'rgba(0,110,245,0.10)',
  inkTint: 'rgba(7,26,61,0.06)',
  successTint: 'rgba(36,178,107,0.14)',
  heartTint: 'rgba(238,85,85,0.12)',
} as const;

/**
 * Translucent surface overlays: `glass` for floating controls / blurred bars,
 * `scrim` for darkening imagery behind foreground content.
 */
export const overlays = {
  glass: 'rgba(255,255,255,0.92)',
  glassLine: 'rgba(7,26,61,0.06)',
  scrim: 'rgba(7,26,61,0.45)',
  scrimSoft: 'rgba(7,26,61,0.18)',
} as const;

/** Recurring gradients (stops + angle). Consumers map to LinearGradient/CSS. */
export const gradients = {
  splash: {
    angle: 180,
    stops: ['#FFFFFF', '#EAF2FF', '#F0FFB8'],
    locations: [0, 0.55, 1],
  },
  profileHeader: {
    angle: 155,
    stops: ['#006EF5', '#0058CC', '#003F99'],
    locations: [0, 0.7, 1],
  },
  avatar: {
    angle: 135,
    stops: ['#006EF5', '#C8FF00'],
    locations: [0, 1],
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
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/* ------------------------------------------------------------------ *
 * Radius
 * ------------------------------------------------------------------ */

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  card: 16,
  hero: 20,
  pill: 999,
} as const;

/* ------------------------------------------------------------------ *
 * Shadows — React Native style objects + web box-shadow strings
 * ------------------------------------------------------------------ */

export interface NativeShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export const shadows = {
  card: { shadowColor: '#071A3D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  pop: { shadowColor: '#071A3D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 8 },
  cta: { shadowColor: '#006EF5', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 6 },
  lime: { shadowColor: '#98C600', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  sheet: { shadowColor: '#071A3D', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.18, shadowRadius: 30, elevation: 16 },
  floatBtn: { shadowColor: '#071A3D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
} as const satisfies Record<string, NativeShadow>;

export const webShadows = {
  card: '0 1px 2px rgba(7,26,61,.04), 0 2px 8px rgba(7,26,61,.04)',
  pop: '0 8px 24px rgba(7,26,61,.08)',
  cta: '0 6px 16px rgba(0,110,245,.28)',
  lime: '0 6px 16px rgba(152,198,0,.30)',
  sheet: '0 -8px 30px rgba(7,26,61,.18)',
  floatBtn: '0 4px 10px rgba(7,26,61,.10)',
} as const;

/* ------------------------------------------------------------------ *
 * Typography
 * ------------------------------------------------------------------ */

export const fonts = {
  /** Web / CSS font stack. */
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
  /** Logical family name; mobile loads "Inter" via expo-font (see apps/mobile). */
  family: 'Inter',
} as const;

export type FontWeight = '400' | '500' | '600' | '700' | '800';

export interface TypeStyle {
  fontSize: number;
  fontWeight: FontWeight;
  letterSpacing: number;
  lineHeight: number;
}

export const typography = {
  display: { fontSize: 32, fontWeight: '800', letterSpacing: -0.64, lineHeight: 38 },
  h1: { fontSize: 26, fontWeight: '700', letterSpacing: -0.78, lineHeight: 32 },
  h1App: { fontSize: 24, fontWeight: '700', letterSpacing: -0.48, lineHeight: 30 },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.44, lineHeight: 28 },
  title: { fontSize: 20, fontWeight: '700', letterSpacing: -0.4, lineHeight: 26 },
  sectionHead: { fontSize: 17, fontWeight: '700', letterSpacing: -0.34, lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: '700', letterSpacing: -0.15, lineHeight: 20 },
  body: { fontSize: 14, fontWeight: '500', letterSpacing: -0.07, lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '600', letterSpacing: -0.065, lineHeight: 18 },
  small: { fontSize: 12, fontWeight: '600', letterSpacing: -0.06, lineHeight: 16 },
  micro: { fontSize: 11, fontWeight: '700', letterSpacing: 0, lineHeight: 14 },
  overline: { fontSize: 12, fontWeight: '700', letterSpacing: 0.96, lineHeight: 16 },
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
  progressStyle: 'pill',
  sportCardStyle: 'border',
  ctaVariant: 'primary',
} as const;

/* ------------------------------------------------------------------ *
 * Sport colors — used for map pins / sport tags. Fallback: brandFallback.
 * (Kept in theme as it is a color concern; selector helper below.)
 * ------------------------------------------------------------------ */

export const sportColors: Record<string, string> = {
  padel: '#1FB6A6',
  tennis: '#F2A33C',
  calcio: '#2ECC71',
  calcio5: '#27AE60',
  calcio7: '#1E9E55',
  calcio8: '#16A085',
  basket: '#E8743B',
  pallavolo: '#6C5CE7',
  beachvolley: '#F6B93B',
  beachtennis: '#E58E26',
  pickleball: '#20BF6B',
  squash: '#8E44AD',
  badminton: '#00A8FF',
  tennistavolo: '#EB3B5A',
  nuoto: '#0FB9B1',
  running: '#FA8231',
  ciclismo: '#3867D6',
  crossfit: '#EB3B5A',
  rugby: '#574B90',
  golf: '#26A65B',
};

export const brandFallback = '#6BA2E0';

/** Returns the brand color for a sport id, with a neutral fallback. */
export function sportColor(sportId: string): string {
  return sportColors[sportId] ?? brandFallback;
}

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
  zIndex,
  easing,
  motion,
  stagger,
  variantDefaults,
  sportColors,
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
