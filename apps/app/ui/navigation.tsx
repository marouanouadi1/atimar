/**
 * Navigation chrome: Header, StepProgress, SocialButton, AuthLayout.
 * Colors/spacing/typography from @/theme/tokens.
 */

import React from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/theme/tokens";
import type { ProgressVariant } from "./core";
import { Divider, Icon, IconButton } from "./primitives";
import { ScreenTitle } from "./typography";
import { textStyle } from "./theme";
import { BrandMark } from "./brand";

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
      style={({ pressed }) => [
        styles.social,
        !isGoogle && styles.socialApple,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon
        name={isGoogle ? "logo-google" : "logo-apple"}
        size={theme.iconSizes.lg}
        color={isGoogle ? "ink" : "surface"}
      />
      <Text style={textStyle("bodyStrong", isGoogle ? "ink" : "surface")}>
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
  /** Called when a social login button is pressed. Providing this prop shows the social buttons. */
  onSocial?: (provider: "google" | "apple") => void;
  /** Optional error message shown below the social buttons. */
  socialError?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  withHero?: boolean;
}

function AuthVisual() {
  const webGradient =
    process.env.EXPO_OS === "web"
      ? ({
          backgroundImage:
            "radial-gradient(circle at 78% 18%, rgba(217,255,67,.24), transparent 26%), linear-gradient(145deg, #12140F 0%, #20251A 100%)",
        } as object)
      : {};

  return (
    <View style={[styles.authVisual, webGradient]}>
      <BrandMark inverse size={46} />
      <View style={styles.authCourt}>
        <View style={styles.authCourtVertical} />
        <View style={styles.authCourtHorizontal} />
        <View style={styles.authBall}>
          <Icon name="tennisball" size={28} color="ink" />
        </View>
      </View>
      <View style={styles.authVisualCopy}>
        <Text style={styles.authKicker}>PLAY YOUR CITY</Text>
        <Text style={styles.authVisualTitle}>
          Il prossimo campo{"\n"}è più vicino di quanto pensi.
        </Text>
        <Text style={styles.authVisualText}>
          Cerca strutture, confronta campi e torna a giocare.
        </Text>
      </View>
    </View>
  );
}

export function AuthLayout({
  title,
  subtitle,
  onBack,
  onSocial,
  socialError,
  children,
  footer,
  withHero,
}: AuthLayoutProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const desktop = width >= theme.breakpoints.desktop;

  return (
    <KeyboardAvoidingView
      style={styles.authRoot}
      behavior={process.env.EXPO_OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.authFrame, desktop && styles.authFrameDesktop]}>
        {withHero && desktop ? <AuthVisual /> : null}
        <View style={styles.authFormSide}>
          {onBack ? (
            <IconButton
              name="arrow-back"
              onPress={onBack}
              tone="surface"
              accessibilityLabel="Indietro"
              style={[
                styles.authBack,
                { top: Math.max(insets.top, theme.spacing.lg) },
              ]}
            />
          ) : null}
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.authScroll,
              {
                paddingTop: desktop
                  ? theme.spacing.xxxl
                  : Math.max(insets.top + 72, theme.spacing.xxxl),
                paddingBottom: insets.bottom + theme.spacing.xxl,
                justifyContent: desktop ? "center" : "flex-start",
              },
            ]}
          >
            <View
              style={[
                styles.authBody,
                {
                  width: desktop
                    ? theme.layout.maxForm
                    : Math.max(width - theme.spacing.xl * 2, 0),
                },
              ]}
            >
              {!desktop ? <BrandMark size={38} /> : null}
              <ScreenTitle title={title} subtitle={subtitle} size="h1" />
              {onSocial ? (
                <>
                  <View style={{ gap: theme.spacing.sm }}>
                    <SocialButton
                      provider="google"
                      onPress={() => onSocial("google")}
                    />
                    {/* Apple Sign In — prossimamente */}
                  </View>
                  {socialError ? (
                    <Text style={[textStyle("caption", "danger"), styles.socialErr]}>
                      {socialError}
                    </Text>
                  ) : null}
                  <Divider label="oppure" />
                </>
              ) : null}
              <View style={{ gap: theme.spacing.md }}>{children}</View>
              <View style={styles.authFooter}>{footer}</View>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    width: "100%",
    maxWidth: theme.layout.maxContent,
    alignSelf: "center",
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
  socialApple: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
  },
  pressed: { opacity: 0.7 },
  socialErr: { textAlign: "center" },
  authRoot: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  authFrame: {
    flex: 1,
  },
  authFrameDesktop: {
    flexDirection: "row",
  },
  authVisual: {
    backgroundColor: theme.colors.ink,
    flex: 1.08,
    minHeight: 230,
    padding: theme.spacing.xxl,
    overflow: "hidden",
  },
  authCourt: {
    position: "absolute",
    width: "68%",
    aspectRatio: 0.72,
    right: "-8%",
    top: "10%",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: theme.radius.xl,
    transform: [{ rotate: "-10deg" }],
  },
  authCourtVertical: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  authCourtHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  authBall: {
    position: "absolute",
    left: "20%",
    bottom: "18%",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.lime,
    ...theme.shadows.lime,
  },
  authVisualCopy: {
    position: "absolute",
    left: theme.spacing.xxxl,
    right: theme.spacing.xxxl,
    bottom: theme.spacing.xxxl,
    gap: theme.spacing.md,
    maxWidth: 560,
  },
  authKicker: {
    color: theme.colors.lime,
    fontFamily: theme.fonts.displayBold,
    fontSize: 12,
    letterSpacing: 2,
  },
  authVisualTitle: {
    color: theme.colors.surface,
    fontFamily: theme.fonts.displayBold,
    fontSize: 46,
    lineHeight: 50,
    letterSpacing: -1.4,
  },
  authVisualText: {
    color: "rgba(255,255,255,0.65)",
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  authFormSide: {
    flex: 0.92,
    backgroundColor: theme.colors.bg,
  },
  authBack: {
    position: "absolute",
    left: theme.spacing.xl,
    zIndex: theme.zIndex.floating,
  },
  authScroll: {
    flexGrow: 1,
    justifyContent: "center",
    boxSizing: "border-box",
  },
  authBody: {
    maxWidth: theme.layout.maxForm,
    alignSelf: "center",
    gap: theme.spacing.xl,
  },
  authFooter: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
});
