/**
 * Navigation chrome: Header, StepProgress, SocialButton, AuthLayout.
 * Colors/spacing/typography from @/theme/tokens.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { theme } from "@/theme/tokens";
import type { ProgressVariant } from "./core";
import { ScreenContainer, Divider, Icon, IconButton } from "./primitives";
import { ScreenTitle } from "./typography";
import { textStyle } from "./theme";

/* ------------------------------------------------------------------ *
 * StepProgress — pill | dots | bar
 * ------------------------------------------------------------------ */

export interface StepProgressProps {
  step: number;
  total: number;
  variant?: ProgressVariant;
  style?: StyleProp<ViewStyle>;
}

export function StepProgress({
  step,
  total,
  variant = "pill",
  style,
}: StepProgressProps) {
  if (variant === "dots") {
    return (
      <View style={[styles.dotsRow, style]}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i + 1 === step ? styles.dotActive : styles.dotIdle,
            ]}
          />
        ))}
      </View>
    );
  }
  if (variant === "bar") {
    const ratio = total > 0 ? Math.min(Math.max(step / total, 0), 1) : 0;
    return (
      <View style={[styles.barTrack, style]}>
        <View style={[styles.barFill, { width: `${ratio * 100}%` }]} />
      </View>
    );
  }
  return (
    <View style={[styles.pill, style]}>
      <Text
        style={textStyle("small", "muted")}
      >{`Step ${step} di ${total}`}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Header — back · (center progress) · right slot
 * ------------------------------------------------------------------ */

export interface HeaderProps {
  onBack?: () => void;
  step?: number;
  total?: number;
  progressVariant?: ProgressVariant;
  right?: React.ReactNode;
  title?: string;
  style?: StyleProp<ViewStyle>;
}

export function Header({
  onBack,
  step,
  total,
  progressVariant,
  right,
  title,
  style,
}: HeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerSide}>
        {onBack ? (
          <IconButton
            name="chevron-back"
            onPress={onBack}
            tone="surface"
            accessibilityLabel="Indietro"
          />
        ) : (
          <View
            style={{
              width: theme.layout.iconButton,
              height: theme.layout.iconButton,
            }}
          />
        )}
      </View>
      <View style={styles.headerCenter}>
        {step != null && total != null ? (
          <StepProgress step={step} total={total} variant={progressVariant} />
        ) : title ? (
          <Text style={textStyle("title", "ink")} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>
      <View style={[styles.headerSide, styles.headerRight]}>{right}</View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * SocialButton — Google / Apple
 * ------------------------------------------------------------------ */

export interface SocialButtonProps {
  provider: "google" | "apple";
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SocialButton({ provider, onPress, style }: SocialButtonProps) {
  const isGoogle = provider === "google";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.social, pressed && styles.pressed, style]}
    >
      <Icon
        name={isGoogle ? "logo-google" : "logo-apple"}
        size={theme.iconSizes.lg}
        color="ink"
      />
      <Text style={textStyle("bodyStrong", "ink")}>
        {isGoogle ? "Continua con Google" : "Continua con Apple"}
      </Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * AuthLayout — shared shell for register & login
 * ------------------------------------------------------------------ */

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onSocial?: (provider: "google" | "apple") => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  onBack,
  onSocial,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <ScreenContainer header={<Header onBack={onBack} />} footer={footer}>
      <View style={styles.authBody}>
        <ScreenTitle title={title} subtitle={subtitle} size="h1" />
        {onSocial ? (
          <View style={{ gap: theme.spacing.sm }}>
            <SocialButton
              provider="google"
              onPress={() => onSocial("google")}
            />
            <SocialButton provider="apple" onPress={() => onSocial("apple")} />
          </View>
        ) : null}
        <Divider label="oppure" />
        <View style={{ gap: theme.spacing.md }}>{children}</View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.chip,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  dot: {
    height: 6,
    borderRadius: theme.radius.pill,
  },
  dotIdle: {
    width: 6,
    backgroundColor: theme.colors.placeholder,
  },
  dotActive: {
    width: 18,
    backgroundColor: theme.colors.lime,
  },
  barTrack: {
    height: 6,
    width: 120,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.placeholder,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lime,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.layout.screenPadX,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  headerSide: {
    minWidth: theme.layout.iconButton,
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  social: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    height: theme.layout.inputHeight,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  pressed: { opacity: 0.7 },
  authBody: {
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
});
