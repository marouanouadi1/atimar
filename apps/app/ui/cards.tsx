/**
 * Composite card / row components built on the primitives + chips.
 * All visuals come from @atimar/theme; product shapes from @atimar/types.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { sportColor, theme } from "@atimar/theme";
import type {
  Booking,
  BookingStatus,
  CourtListItem,
  HeroKind,
  Venue,
} from "@atimar/types";
import { pluralize } from "@atimar/utils";
import { Card, Icon, IconButton } from "./primitives";
import { AvailabilityBadge, IconBadge, PriceTag, RatingBadge } from "./chips";
import { textStyle } from "./theme";

/* ------------------------------------------------------------------ *
 * CourtHero — graphic placeholder for a court/venue (no external images)
 * ------------------------------------------------------------------ */

const HERO_ICON: Record<HeroKind, string> = {
  "tennis-clay": "tennisball",
  "padel-green": "tennisball",
  "padel-blue": "tennisball",
  beach: "sunny",
  soccer: "football",
};

export interface CourtHeroProps {
  heroKind: HeroKind;
  sportId: string;
  height?: number;
  rounded?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function CourtHero({
  heroKind,
  sportId,
  height,
  rounded = true,
  children,
  style,
}: CourtHeroProps) {
  return (
    <View
      style={[
        styles.hero,
        {
          height: height ?? theme.layout.cardHeroHeight,
          borderRadius: rounded ? theme.radius.card : 0,
        },
        style,
      ]}
    >
      <Icon
        name={HERO_ICON[heroKind]}
        size={theme.iconSizes.hero}
        color={sportColor(sportId)}
      />
      {children}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * CourtCard — large (hero on top) | compact (horizontal row)
 * ------------------------------------------------------------------ */

export interface CourtCardProps {
  court: CourtListItem;
  variant?: "large" | "compact";
  onPress?: () => void;
  onFav?: () => void;
  isFav?: boolean;
  /** Fixed width for horizontal carousels (large variant). */
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export function CourtCard({
  court,
  variant = "large",
  onPress,
  onFav,
  isFav = false,
  width,
  style,
}: CourtCardProps) {
  if (variant === "compact") {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.compact,
          pressed && styles.pressed,
          style,
        ]}
      >
        <CourtHero
          heroKind={court.heroKind}
          sportId={court.sportId}
          height={76}
          style={styles.compactThumb}
        />
        <View style={styles.compactBody}>
          <Text style={textStyle("bodyStrong", "ink")} numberOfLines={1}>
            {court.venueName}
          </Text>
          <Text style={textStyle("caption", "muted")} numberOfLines={1}>
            {court.sport} · {court.distance}
          </Text>
          <View style={styles.rowGapSm}>
            <RatingBadge value={court.rating} />
            <Text style={textStyle("caption", "primary")}>{court.price}</Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={theme.iconSizes.md} color="subtle" />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.large,
        width != null && { width },
        pressed && styles.pressed,
        style,
      ]}
    >
      <CourtHero heroKind={court.heroKind} sportId={court.sportId}>
        <View style={styles.heroTopRow}>
          <AvailabilityBadge
            state={court.open ? "open" : "closed"}
            label={court.open ? "Aperto" : "Chiuso"}
          />
          <IconButton
            name={isFav ? "heart" : "heart-outline"}
            tone="glass"
            size={36}
            iconSize={theme.iconSizes.md}
            active={isFav}
            onPress={onFav}
            accessibilityLabel="Preferito"
          />
        </View>
        <View style={styles.heroBottomRow}>
          <PriceTag label={court.price} />
        </View>
      </CourtHero>
      <View style={styles.largeBody}>
        <Text style={textStyle("bodyStrong", "ink")} numberOfLines={1}>
          {court.venueName}
        </Text>
        <View style={styles.rowBetween}>
          <Text style={textStyle("caption", "muted")} numberOfLines={1}>
            {court.sport} · {court.surface}
          </Text>
          <RatingBadge
            value={court.rating}
            count={court.reviewsCount}
            showCount
          />
        </View>
        <View style={styles.rowGapSm}>
          <Icon
            name="location-outline"
            size={theme.iconSizes.sm}
            color="subtle"
          />
          <Text style={textStyle("caption", "muted")} numberOfLines={1}>
            {court.distance} · {court.address}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * VenueCard — secondary context (structure with N courts)
 * ------------------------------------------------------------------ */

export interface VenueCardProps {
  venue: Venue;
  courtCount?: number;
  onPress?: () => void;
  onFav?: () => void;
  isFav?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function VenueCard({
  venue,
  courtCount,
  onPress,
  onFav,
  isFav = false,
  style,
}: VenueCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.compact,
        pressed && styles.pressed,
        style,
      ]}
    >
      <CourtHero
        heroKind={venue.heroKind}
        sportId={venue.sportIds[0] ?? "padel"}
        height={76}
        style={styles.compactThumb}
      />
      <View style={styles.compactBody}>
        <Text style={textStyle("bodyStrong", "ink")} numberOfLines={1}>
          {venue.name}
        </Text>
        <Text style={textStyle("caption", "muted")} numberOfLines={1}>
          {venue.distance}
          {courtCount != null
            ? ` · ${pluralize(courtCount, "campo", "campi")}`
            : ""}
        </Text>
        <RatingBadge
          value={venue.rating}
          count={venue.reviewsCount}
          showCount
        />
      </View>
      {onFav ? (
        <IconButton
          name={isFav ? "heart" : "heart-outline"}
          tone="plain"
          size={32}
          iconSize={theme.iconSizes.md}
          active={isFav}
          onPress={onFav}
          accessibilityLabel="Preferito"
        />
      ) : (
        <Icon name="chevron-forward" size={theme.iconSizes.md} color="subtle" />
      )}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * BookingCard — a request/booking summary row
 * ------------------------------------------------------------------ */

const BOOKING_STATUS: Record<
  BookingStatus,
  { label: string; fg: string; bg: string }
> = {
  requested: {
    label: "In attesa",
    fg: theme.colors.muted,
    bg: theme.tints.inkTint,
  },
  confirmed: {
    label: "Confermata",
    fg: theme.colors.success,
    bg: theme.tints.successTint,
  },
  declined: {
    label: "Rifiutata",
    fg: theme.semantic.danger,
    bg: theme.tints.heartTint,
  },
  cancelled: {
    label: "Annullata",
    fg: theme.colors.muted,
    bg: theme.tints.inkTint,
  },
};

export interface BookingCardProps {
  booking: Booking;
  venueName?: string;
  courtName?: string;
  sport?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function BookingCard({
  booking,
  venueName,
  courtName,
  sport,
  onPress,
  style,
}: BookingCardProps) {
  const s = BOOKING_STATUS[booking.status];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed, style]}
    >
      <Card style={{ gap: theme.spacing.sm }}>
        <View style={styles.rowBetween}>
          <Text style={textStyle("bodyStrong", "ink")} numberOfLines={1}>
            {venueName ?? "Struttura"}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: s.bg }]}>
            <Text style={[textStyle("micro"), { color: s.fg }]}>{s.label}</Text>
          </View>
        </View>
        <View style={styles.rowGapSm}>
          <Icon
            name="calendar-outline"
            size={theme.iconSizes.sm}
            color="subtle"
          />
          <Text style={textStyle("caption", "muted")}>
            {booking.date} · {booking.slot.start}–{booking.slot.end}
          </Text>
        </View>
        {courtName || sport ? (
          <View style={styles.rowGapSm}>
            <Icon
              name="tennisball-outline"
              size={theme.iconSizes.sm}
              color="subtle"
            />
            <Text style={textStyle("caption", "muted")}>
              {[courtName, sport].filter(Boolean).join(" · ")}
            </Text>
          </View>
        ) : null}
      </Card>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * SportSelectCard — setup sport selection
 * ------------------------------------------------------------------ */

export interface SportSelectCardProps {
  label: string;
  icon: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SportSelectCard({
  label,
  icon,
  active = false,
  onPress,
  style,
}: SportSelectCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.sportCard,
        active ? styles.sportCardActive : styles.sportCardIdle,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon
        name={icon}
        size={theme.iconSizes.xxl}
        color={active ? "limeDark" : "muted"}
      />
      <Text
        style={textStyle("caption", active ? "ink" : "text")}
        numberOfLines={1}
      >
        {label}
      </Text>
      {active ? (
        <View style={styles.sportCheck}>
          <Icon name="checkmark" size={theme.iconSizes.xs} color="ink" />
        </View>
      ) : null}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * TimeOfDayCard — availability time-of-day selection
 * ------------------------------------------------------------------ */

export interface TimeOfDayCardProps {
  label: string;
  range: string;
  icon: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function TimeOfDayCard({
  label,
  range,
  icon,
  active = false,
  onPress,
  style,
}: TimeOfDayCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.timeCard,
        active ? styles.sportCardActive : styles.sportCardIdle,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon
        name={icon}
        size={theme.iconSizes.xl}
        color={active ? "limeDark" : "muted"}
      />
      <View>
        <Text style={textStyle("bodyStrong", active ? "ink" : "text")}>
          {label}
        </Text>
        <Text style={textStyle("caption", "muted")}>{range}</Text>
      </View>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * OptionRow — level selection row (kept for future 5-step setup)
 * ------------------------------------------------------------------ */

export interface OptionRowProps {
  title: string;
  desc?: string;
  icon: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function OptionRow({
  title,
  desc,
  icon,
  active = false,
  onPress,
  style,
}: OptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionRow,
        active ? styles.optionRowActive : styles.sportCardIdle,
        pressed && styles.pressed,
        style,
      ]}
    >
      <IconBadge icon={icon} tone={active ? "lime" : "ink"} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={textStyle("bodyStrong", "ink")}>{title}</Text>
        {desc ? (
          <Text style={textStyle("caption", "muted")}>{desc}</Text>
        ) : null}
      </View>
      <View style={[styles.radio, active && styles.radioActive]}>
        {active ? (
          <Icon name="checkmark" size={theme.iconSizes.xs} color="ink" />
        ) : null}
      </View>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * BenefitRow — icon badge + title + desc
 * ------------------------------------------------------------------ */

export interface BenefitRowProps {
  icon: string;
  title: string;
  desc: string;
  tone?: React.ComponentProps<typeof IconBadge>["tone"];
  style?: StyleProp<ViewStyle>;
}

export function BenefitRow({
  icon,
  title,
  desc,
  tone = "lime",
  style,
}: BenefitRowProps) {
  return (
    <View style={[styles.benefit, style]}>
      <IconBadge icon={icon} tone={tone} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={textStyle("bodyStrong", "ink")}>{title}</Text>
        <Text style={textStyle("caption", "muted")}>{desc}</Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * MenuList + ProfileMenuItem
 * ------------------------------------------------------------------ */

export interface MenuListProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function MenuList({ children, style }: MenuListProps) {
  return <View style={[styles.menuList, style]}>{children}</View>;
}

export interface ProfileMenuItemProps {
  icon: string;
  label: string;
  sub?: string;
  badge?: string;
  onPress?: () => void;
  last?: boolean;
  tone?: React.ComponentProps<typeof IconBadge>["tone"];
  danger?: boolean;
}

export function ProfileMenuItem({
  icon,
  label,
  sub,
  badge,
  onPress,
  last = false,
  tone = "ink",
  danger = false,
}: ProfileMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuRow,
        !last && styles.menuRowBorder,
        pressed && styles.pressed,
      ]}
    >
      <IconBadge icon={icon} tone={tone} size={36} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={textStyle("bodyStrong", danger ? "danger" : "ink")}>
          {label}
        </Text>
        {sub ? <Text style={textStyle("caption", "muted")}>{sub}</Text> : null}
      </View>
      {badge ? (
        <View style={styles.menuBadge}>
          <Text style={textStyle("micro", "ink")}>{badge}</Text>
        </View>
      ) : null}
      {!danger ? (
        <Icon name="chevron-forward" size={theme.iconSizes.md} color="subtle" />
      ) : null}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * DetailStat — a small labeled stat
 * ------------------------------------------------------------------ */

export interface DetailStatProps {
  icon: string;
  value: string;
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function DetailStat({ icon, value, label, style }: DetailStatProps) {
  return (
    <View style={[styles.detailStat, style]}>
      <Icon name={icon} size={theme.iconSizes.lg} color="primary" />
      <Text style={textStyle("bodyStrong", "ink")}>{value}</Text>
      <Text style={textStyle("small", "muted")}>{label}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * InfoBanner — neutral info row
 * ------------------------------------------------------------------ */

export interface InfoBannerProps {
  icon?: string;
  children: React.ReactNode;
  tone?: "neutral" | "lime";
  style?: StyleProp<ViewStyle>;
}

export function InfoBanner({
  icon = "information-circle",
  children,
  tone = "neutral",
  style,
}: InfoBannerProps) {
  const lime = tone === "lime";
  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: lime ? theme.tints.limeTint : theme.colors.chip },
        style,
      ]}
    >
      <Icon
        name={icon}
        size={theme.iconSizes.md}
        color={lime ? "limeDark" : "muted"}
      />
      <Text style={[textStyle("caption", "text"), { flex: 1 }]}>
        {children}
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * EmptyState
 * ------------------------------------------------------------------ */

export interface EmptyStateProps {
  icon: string;
  title: string;
  desc?: string;
  cta?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({ icon, title, desc, cta, style }: EmptyStateProps) {
  return (
    <View style={[styles.empty, style]}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={theme.iconSizes.xxl} color="limeDark" />
      </View>
      <Text style={[textStyle("title", "ink"), styles.textCenter]}>
        {title}
      </Text>
      {desc ? (
        <Text style={[textStyle("body", "muted"), styles.textCenter]}>
          {desc}
        </Text>
      ) : null}
      {cta}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * CheckBadge — success check disc (summary / booking confirm)
 * ------------------------------------------------------------------ */

export interface CheckBadgeProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function CheckBadge({ size = 96, style }: CheckBadgeProps) {
  return (
    <View
      style={[
        styles.checkOuter,
        { width: size, height: size, borderRadius: theme.radius.pill },
        style,
      ]}
    >
      <View
        style={[
          styles.checkInner,
          {
            width: size * 0.66,
            height: size * 0.66,
            borderRadius: theme.radius.pill,
          },
        ]}
      >
        <Icon name="checkmark" size={size * 0.36} color="ink" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  rowGapSm: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  textCenter: { textAlign: "center" },

  hero: {
    backgroundColor: theme.colors.chip,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroTopRow: {
    position: "absolute",
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  heroBottomRow: {
    position: "absolute",
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
  },

  large: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    overflow: "hidden",
    ...theme.shadows.card,
  },
  largeBody: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },

  compact: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    ...theme.shadows.card,
  },
  compactThumb: {
    width: 76,
  },
  compactBody: {
    flex: 1,
    gap: theme.spacing.xs,
  },

  statusPill: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
  },

  sportCard: {
    flex: 1,
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
  },
  sportCardIdle: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  sportCardActive: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.lime,
  },
  sportCheck: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 18,
    height: 18,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },

  timeCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
  },
  optionRowActive: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.lime,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: theme.radius.pill,
    borderWidth: 2,
    borderColor: theme.colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    backgroundColor: theme.colors.lime,
    borderColor: theme.colors.lime,
  },

  benefit: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },

  menuList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.line,
  },
  menuBadge: {
    paddingVertical: 2,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lime,
  },

  detailStat: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },

  empty: {
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xxxl,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.tints.limeTint,
    alignItems: "center",
    justifyContent: "center",
  },

  checkOuter: {
    backgroundColor: theme.tints.limeTint,
    alignItems: "center",
    justifyContent: "center",
  },
  checkInner: {
    backgroundColor: theme.colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
});
