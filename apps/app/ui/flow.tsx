/**
 * FlowScreen — shared shell for the setup/onboarding wizard steps.
 *
 * Centralizes the web-vs-native branch that used to be repeated per screen:
 * native keeps the app chrome (chevron-back header + pinned footer CTA);
 * web drops both in favor of a plain scrollable column under the global
 * `WebHeader` (mounted by the setup layout), a horizontal progress bar, and
 * inline actions — no app-style pinned footer, no chevron-back.
 */

import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/tokens";
import type { ButtonVariant } from "./core";
import { Button, ScreenContainer } from "./primitives";
import { Header, StepProgress } from "./navigation";
import { ScreenTitle } from "./typography";
import { textStyle } from "./theme";

export interface FlowScreenProps {
  title: string;
  subtitle?: string;
  /** Progress indicator; omit both on edit-single-section screens. */
  step?: number;
  total?: number;
  onBack?: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  primaryVariant?: ButtonVariant;
  /** Trailing chevron on the primary button (final-step CTA style). */
  primaryIcon?: boolean;
  /** Optional tertiary ghost action (e.g. summary's "Rivedi"). */
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Gap between title and content — matches each screen's prior density. */
  bodyGap?: number;
  children: React.ReactNode;
}

export function FlowScreen({
  title,
  subtitle,
  step,
  total,
  onBack,
  primaryLabel,
  onPrimary,
  primaryDisabled,
  primaryVariant = "primary",
  primaryIcon = false,
  secondaryLabel,
  onSecondary,
  bodyGap = theme.spacing.xl,
  children,
}: FlowScreenProps) {
  if (Platform.OS !== "web") {
    return (
      <ScreenContainer
        header={<Header onBack={onBack} step={step} total={total} />}
        footer={
          <View style={styles.nativeFooter}>
            <Button
              variant={primaryVariant}
              icon={primaryIcon}
              disabled={primaryDisabled}
              onPress={onPrimary}
            >
              {primaryLabel}
            </Button>
            {secondaryLabel ? (
              <Button variant="ghost" onPress={onSecondary}>
                {secondaryLabel}
              </Button>
            ) : null}
          </View>
        }
      >
        <View style={[styles.body, { gap: bodyGap }]}>
          <ScreenTitle title={title} subtitle={subtitle} size="h1" />
          {children}
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      footer={
        <View style={styles.actionsRow}>
          <View style={styles.actionsLeft}>
            {onBack ? (
              <Button variant="ghost" fullWidth={false} onPress={onBack}>
                Indietro
              </Button>
            ) : null}
          </View>
          <View style={styles.actionsRight}>
            {secondaryLabel ? (
              <Button variant="ghost" fullWidth={false} onPress={onSecondary}>
                {secondaryLabel}
              </Button>
            ) : null}
            <Button
              variant={primaryVariant}
              icon={primaryIcon}
              fullWidth={false}
              disabled={primaryDisabled}
              onPress={onPrimary}
              style={styles.primaryBtn}
            >
              {primaryLabel}
            </Button>
          </View>
        </View>
      }
    >
      <View style={[styles.body, { gap: bodyGap }]}>
        {step != null && total != null ? (
          <View style={styles.progressRow}>
            <StepProgress step={step} total={total} variant="bar" />
            <Text style={textStyle("small", "muted")}>
              {`Step ${step} di ${total}`}
            </Text>
          </View>
        ) : null}
        <ScreenTitle title={title} subtitle={subtitle} size="h1" />
        {children}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xxxl,
    width: "100%",
    maxWidth: theme.layout.maxReading,
    alignSelf: "center",
  },
  nativeFooter: {
    gap: theme.spacing.sm,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  actionsLeft: {
    flexDirection: "row",
  },
  actionsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  primaryBtn: {
    minWidth: 180,
  },
});
