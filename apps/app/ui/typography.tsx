/**
 * Text / titling components. Type metrics + colors come from @/theme/tokens.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { theme } from '@/theme/tokens';
import { textStyle } from './theme';

/* ------------------------------------------------------------------ *
 * ScreenTitle / TitleBlock — title + optional subtitle at the top of a screen
 * ------------------------------------------------------------------ */

export interface ScreenTitleProps {
  title: string;
  subtitle?: string;
  /** Size of the title: 'h1' onboarding/auth, 'h1App' app screens, 'h2' detail. */
  size?: 'h1' | 'h1App' | 'h2';
  align?: 'left' | 'center';
  style?: StyleProp<ViewStyle>;
}

export function ScreenTitle({
  title,
  subtitle,
  size = 'h1App',
  align = 'left',
  style,
}: ScreenTitleProps) {
  return (
    <View style={[{ gap: theme.spacing.sm }, align === 'center' && styles.center, style]}>
      <Text style={[textStyle(size, 'ink'), align === 'center' && styles.textCenter]}>{title}</Text>
      {subtitle ? (
        <Text style={[textStyle('body', 'muted'), align === 'center' && styles.textCenter]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * SectionTitle — small UPPERCASE overline label
 * ------------------------------------------------------------------ */

export interface SectionTitleProps {
  children: string;
  style?: StyleProp<TextStyle>;
}

export function SectionTitle({ children, style }: SectionTitleProps) {
  return (
    <Text style={[textStyle('overline', 'subtle'), styles.overline, style]}>
      {children.toUpperCase()}
    </Text>
  );
}

/* ------------------------------------------------------------------ *
 * SectionHeaderRow — section title + trailing action link ("Vedi tutti")
 * ------------------------------------------------------------------ */

export interface SectionHeaderRowProps {
  title: string;
  onAction?: () => void;
  actionLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeaderRow({
  title,
  onAction,
  actionLabel = 'Vedi tutti',
  style,
}: SectionHeaderRowProps) {
  return (
    <View style={[styles.headerRow, style]}>
      <Text style={textStyle('sectionHead', 'ink')}>{title}</Text>
      {onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={textStyle('caption', 'primary')}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  textCenter: { textAlign: 'center' },
  overline: { textTransform: 'uppercase' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
