/**
 * Chips, tags and badges. Variant-to-token mapping lives in ./core;
 * this layer only renders. Colors/spacing from @/theme/tokens.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { sportColor, theme } from '@/theme/tokens';
import {
  resolveAvailabilitySpec,
  resolveIconBadgeSpec,
} from './core';
import type {
  AvailabilityState,
  FilterChipVariant,
  IconBadgeTone,
} from './core';
import { formatRating } from '@atimar/utils';
import { Icon } from './primitives';
import { resolveColor, resolveTint, textStyle } from './theme';

/* ------------------------------------------------------------------ *
 * SportChip — quick filter / sport selection pill
 * ------------------------------------------------------------------ */

export interface SportChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

export function SportChip({ label, active = false, onPress, icon, style }: SportChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipActive : styles.chipIdle,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={theme.iconSizes.sm} color={active ? 'ink' : 'muted'} /> : null}
      <Text style={textStyle('caption', active ? 'ink' : 'text')}>{label}</Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * FilterChip — pill or segmented control item
 * ------------------------------------------------------------------ */

export interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  variant?: FilterChipVariant;
  style?: StyleProp<ViewStyle>;
}

export function FilterChip({
  label,
  active = false,
  onPress,
  variant = 'pill',
  style,
}: FilterChipProps) {
  const segment = variant === 'segment';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        segment ? styles.segment : styles.chip,
        segment
          ? active && styles.segmentActive
          : active
          ? styles.chipInk
          : styles.chipIdle,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={textStyle(
          'caption',
          segment ? (active ? 'ink' : 'muted') : active ? 'surface' : 'text',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * SportTag — sport label with a sport-colored dot
 * ------------------------------------------------------------------ */

export interface SportTagProps {
  label: string;
  sportId: string;
  style?: StyleProp<ViewStyle>;
}

export function SportTag({ label, sportId, style }: SportTagProps) {
  return (
    <View style={[styles.tag, style]}>
      <View style={[styles.dot, { backgroundColor: sportColor(sportId) }]} />
      <Text style={textStyle('small', 'text')}>{label}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * DayChip — availability day toggle
 * ------------------------------------------------------------------ */

export interface DayChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function DayChip({ label, active = false, onPress }: DayChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dayChip,
        active ? styles.chipActive : styles.chipIdle,
        pressed && styles.pressed,
      ]}
    >
      <Text style={textStyle('caption', active ? 'ink' : 'text')}>{label}</Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * IconBadge — square tinted background + icon (tone)
 * ------------------------------------------------------------------ */

export interface IconBadgeProps {
  icon: string;
  tone?: IconBadgeTone;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function IconBadge({ icon, tone = 'lime', size = 40, style }: IconBadgeProps) {
  const spec = resolveIconBadgeSpec(tone);
  return (
    <View
      style={[
        styles.iconBadge,
        { width: size, height: size, backgroundColor: resolveTint(spec.tint) },
        style,
      ]}
    >
      <Icon name={icon} size={Math.round(size * 0.5)} color={spec.fg} />
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * AvailabilityBadge — open/closed/free/busy pill with dot
 * ------------------------------------------------------------------ */

export interface AvailabilityBadgeProps {
  state: AvailabilityState;
  /** Override the default label (e.g. "Aperto ora"). */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function AvailabilityBadge({ state, label, style }: AvailabilityBadgeProps) {
  const spec = resolveAvailabilitySpec(state);
  return (
    <View style={[styles.availBadge, { backgroundColor: resolveTint(spec.tint) }, style]}>
      <View style={[styles.statusDot, { backgroundColor: resolveColor(spec.fg) }]} />
      <Text style={textStyle('micro', spec.fg)}>{label ?? spec.label}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * RatingBadge — star + value (+ optional review count)
 * ------------------------------------------------------------------ */

export interface RatingBadgeProps {
  value: number;
  count?: number;
  showCount?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function RatingBadge({ value, count, showCount = false, size = theme.iconSizes.sm, style }: RatingBadgeProps) {
  return (
    <View style={[styles.rating, style]}>
      <Icon name="star" size={size} color="star" />
      <Text style={textStyle('caption', 'ink')}>{formatRating(value)}</Text>
      {showCount && count != null ? (
        <Text style={textStyle('caption', 'subtle')}>({count})</Text>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * PriceTag — micro pill showing a price string
 * ------------------------------------------------------------------ */

export interface PriceTagProps {
  label: string;
  tone?: 'lime' | 'surface';
  style?: StyleProp<ViewStyle>;
}

export function PriceTag({ label, tone = 'lime', style }: PriceTagProps) {
  const lime = tone === 'lime';
  return (
    <View
      style={[
        styles.priceTag,
        { backgroundColor: lime ? theme.colors.lime : theme.overlays.glass },
        style,
      ]}
    >
      <Text style={textStyle('micro', 'ink')}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    height: 36,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
  },
  chipIdle: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  chipActive: {
    backgroundColor: theme.colors.lime,
    borderWidth: 1,
    borderColor: theme.colors.lime,
  },
  chipInk: {
    backgroundColor: theme.colors.ink,
  },
  pressed: { opacity: 0.7 },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
  },
  segmentActive: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.chip,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.pill,
  },
  dayChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: theme.radius.md,
  },
  iconBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
  },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: theme.radius.pill,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  priceTag: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
  },
});
