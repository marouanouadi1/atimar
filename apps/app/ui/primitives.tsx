/**
 * Foundational React Native primitives.
 * All colors/spacing/typography come from @/theme/tokens — never hardcoded.
 */

import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/theme/tokens";
import { resolveButtonSpec } from "./core";
import type { ButtonVariant } from "./core";
import { resolveColor } from "./theme";
import { BrandMark } from "./brand";

type IonName = keyof typeof Ionicons.glyphMap;

/* ------------------------------------------------------------------ *
 * Icon — single controlled wrapper over @expo/vector-icons (Ionicons)
 * ------------------------------------------------------------------ */

export interface IconProps {
  /** Ionicons glyph name (sport icon strings from @atimar/data are valid). */
  name: string;
  size?: number;
  /** Color token name (brand/semantic) or raw hex/rgba. */
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function Icon({
  name,
  size = theme.iconSizes.xl,
  color = "ink",
  style,
}: IconProps) {
  return (
    <Ionicons
      name={name as IonName}
      size={size}
      color={resolveColor(color)}
      style={style}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Button
 * ------------------------------------------------------------------ */

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** Show a trailing chevron (primary CTA style). */
  icon?: boolean;
  /** Optional leading Ionicons name. */
  leadingIcon?: string;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Button({
  children,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  icon = false,
  leadingIcon,
  fullWidth = true,
  style,
  testID,
}: ButtonProps) {
  const spec = resolveButtonSpec(variant, disabled);
  const bg = spec.bg ? resolveColor(spec.bg) : "transparent";
  const fg = resolveColor(spec.fg);
  const shadow = spec.shadow ? theme.shadows[spec.shadow] : undefined;
  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.btn,
        fullWidth && styles.btnFull,
        {
          backgroundColor: bg,
          height: spec.height,
          borderRadius: theme.radius.pill,
          opacity: pressed ? 0.92 : 1,
        },
        !isDisabled && shadow,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <>
          {leadingIcon ? (
            <Icon name={leadingIcon} size={theme.iconSizes.md} color={spec.fg} />
          ) : null}
          <Text style={[styles.btnLabel, { color: fg }]}>{children}</Text>
          {icon ? (
            <Icon
              name="chevron-forward"
              size={theme.iconSizes.lg}
              color={spec.fg}
            />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * IconButton — round tappable icon (back, heart, map controls, floating CTAs)
 * ------------------------------------------------------------------ */

export type IconButtonTone = "plain" | "surface" | "glass" | "primary";

export interface IconButtonProps {
  name: string;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  tone?: IconButtonTone;
  /** Icon color token/hex. */
  color?: string;
  /** Toggle state (e.g. favorite heart). */
  active?: boolean;
  /** Icon color when `active`. */
  activeColor?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  name,
  onPress,
  size = theme.layout.iconButton,
  iconSize = theme.iconSizes.lg,
  tone = "plain",
  color = "ink",
  active = false,
  activeColor = "heart",
  accessibilityLabel,
  style,
}: IconButtonProps) {
  const toneStyle = toneStyles[tone];
  const iconColor = active ? activeColor : color;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconBtn,
        { width: size, height: size, borderRadius: theme.radius.pill },
        toneStyle.container,
        tone === "glass" && theme.shadows.floatBtn,
        tone === "surface" && theme.shadows.card,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon name={name} size={iconSize} color={iconColor} />
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * Card
 * ------------------------------------------------------------------ */

export interface CardProps {
  children: React.ReactNode;
  padding?: number;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  padding = theme.spacing.lg,
  elevated = true,
  style,
}: CardProps) {
  return (
    <View
      style={[styles.card, { padding }, elevated && theme.shadows.card, style]}
    >
      {children}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Divider
 * ------------------------------------------------------------------ */

export interface DividerProps {
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function Divider({ label, style }: DividerProps) {
  if (!label) {
    return <View style={[styles.hairline, style]} />;
  }
  return (
    <View style={[styles.dividerRow, style]}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerLabel}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Avatar — initials (gradient variant approximated with a solid brand fill)
 * ------------------------------------------------------------------ */

export interface AvatarProps {
  name: string;
  size?: number;
  variant?: "lime" | "gradient";
  style?: StyleProp<ViewStyle>;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  size = 64,
  variant = "lime",
  style,
}: AvatarProps) {
  const bg = variant === "lime" ? theme.colors.lime : theme.colors.primary;
  const fg = variant === "lime" ? theme.colors.ink : theme.colors.surface;
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: theme.radius.pill,
          backgroundColor: bg,
        },
        style,
      ]}
    >
      <Text style={{ color: fg, fontSize: size * 0.38, fontWeight: "700" }}>
        {initials(name)}
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Logo — wordmark with a lime accent bar
 * ------------------------------------------------------------------ */

export interface LogoProps {
  scale?: number;
  style?: StyleProp<ViewStyle>;
}

export function Logo({ scale = 1, style }: LogoProps) {
  return <BrandMark size={42 * scale} style={style} />;
}

/* ------------------------------------------------------------------ *
 * ScreenContainer / SafeScreen
 * ------------------------------------------------------------------ */

export interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Renders below the body, full-width, outside the maxWidth constraint. */
  fullWidthFooter?: React.ReactNode;
  /** Apply the top safe-area inset (set false when a custom header handles it). */
  safeTop?: boolean;
  /** Background color token. */
  background?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function ScreenContainer({
  children,
  scroll = true,
  header,
  footer,
  fullWidthFooter,
  safeTop = true,
  background = "bg",
  style,
  contentStyle,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const desktop = width >= theme.breakpoints.desktop;
  const bottomPad = footer ? 0 : insets.bottom + theme.spacing.xxxl;
  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: resolveColor(background),
          paddingTop: safeTop ? insets.top : 0,
        },
        style,
      ]}
    >
      {header}
      {scroll ? (
        <ScrollView
          style={styles.body}
          contentContainerStyle={[
            styles.bodyContent,
            {
              paddingBottom: bottomPad,
              paddingHorizontal: desktop
                ? theme.layout.screenPadDesktop
                : theme.layout.screenPadX,
            },
            contentStyle,
          ]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.body,
            styles.bodyContent,
            {
              paddingBottom: bottomPad,
              paddingHorizontal: desktop
                ? theme.layout.screenPadDesktop
                : theme.layout.screenPadX,
            },
            contentStyle,
          ]}
        >
          {children}
        </View>
      )}
      {footer ? (
        <View style={styles.footer}>
          <View
            style={[
              styles.footerInner,
              {
                paddingBottom: insets.bottom + theme.spacing.lg,
                paddingHorizontal: desktop
                  ? theme.layout.screenPadDesktop
                  : theme.layout.screenPadX,
              },
            ]}
          >
            {footer}
          </View>
        </View>
      ) : null}
      {fullWidthFooter ?? null}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

const toneStyles = {
  plain: StyleSheet.create({ container: { backgroundColor: "transparent" } }),
  surface: StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.line,
    },
  }),
  glass: StyleSheet.create({
    container: {
      backgroundColor: theme.overlays.glass,
      borderWidth: 1,
      borderColor: theme.overlays.glassLine,
    },
  }),
  primary: StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primary,
    },
  }),
} as const;

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  btnFull: {
    alignSelf: "stretch",
  },
  btnLabel: {
    fontSize: theme.typography.bodyStrong.fontSize,
    fontWeight: "700",
    letterSpacing: theme.typography.bodyStrong.letterSpacing,
  } as TextStyle,
  iconBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.line,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.line,
  },
  dividerLabel: {
    color: theme.colors.subtle,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: "600",
  } as TextStyle,
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  screen: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingTop: theme.spacing.sm,
    width: "100%",
    maxWidth: theme.layout.maxContent,
    alignSelf: "center",
    boxSizing: "border-box",
  },
  footer: {
    backgroundColor: theme.colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.line,
  },
  footerInner: {
    width: "100%",
    maxWidth: theme.layout.maxReading,
    alignSelf: "center",
    paddingTop: theme.spacing.md,
    boxSizing: "border-box",
  },
});
