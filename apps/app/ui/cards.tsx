/**
 * Componenti card/riga composti — costruiti sui primitivi + chip.
 * Tutta la grafica viene da @/theme/tokens; le shape di prodotto da @atimar/types.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { theme } from "@/theme/tokens";
import type {
  CampoInLista,
  TipoHero,
  Struttura,
} from "@atimar/types";
import { pluralize } from "@atimar/utils";
import { sportLabel } from "@atimar/data";
import { Card, Icon, IconButton } from "./primitives";
import { AvailabilityBadge, IconBadge, PriceTag, RatingBadge } from "./chips";
import { textStyle } from "./theme";
import { MediaStruttura } from "./media";
import { isWeb, useHover, webElev, webTransition } from "./web-fx";

/* ------------------------------------------------------------------ *
 * CampoHero — grafica hero per un campo/struttura (nessuna immagine esterna)
 * ------------------------------------------------------------------ */

export interface CampoHeroProps {
  tipoHero: TipoHero;
  idSport: string;
  photoUrl?: string | null;
  height?: number;
  rounded?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function CampoHero({
  idSport,
  photoUrl,
  height,
  rounded = true,
  children,
  style,
}: CampoHeroProps) {
  return (
    <MediaStruttura
      photoUrl={photoUrl}
      sportId={idSport}
      height={height}
      rounded={rounded}
      style={style}
    >
      {children}
    </MediaStruttura>
  );
}

/* ------------------------------------------------------------------ *
 * CampoCard — grande (hero in alto) | compatta (riga orizzontale)
 * ------------------------------------------------------------------ */

export interface CampoCardProps {
  campo: CampoInLista;
  variant?: "large" | "compact";
  onPress?: () => void;
  onFav?: () => void;
  isFav?: boolean;
  /** Larghezza fissa per caroselli orizzontali (variante large). */
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export function CampoCard({
  campo,
  variant = "large",
  onPress,
  onFav,
  isFav = false,
  width,
  style,
}: CampoCardProps) {
  const { hovered, hoverProps } = useHover();

  if (variant === "compact") {
    return (
      <Pressable
        onPress={onPress}
        {...hoverProps}
        style={({ pressed }) => [
          styles.compact,
          isWeb && styles.compactElev,
          webTransition("border-color, box-shadow, transform", 180),
          hovered && styles.compactHover,
          pressed && styles.pressed,
          style,
        ]}
      >
        <CampoHero
          tipoHero={campo.tipoHero}
          idSport={campo.idSport}
          photoUrl={campo.urlFotoCopertina}
          height={76}
          style={styles.compactThumb}
        />
        <View style={styles.compactBody}>
          <Text style={textStyle("bodyStrong", "ink")} numberOfLines={1}>
            {campo.nomeStruttura}
          </Text>
          <Text style={textStyle("caption", "muted")} numberOfLines={1}>
            {sportLabel(campo.idSport)}
            {campo.distanza ? ` · ${campo.distanza}` : ""}
          </Text>
          <View style={styles.rowGapSm}>
            <RatingBadge value={campo.mediaVoti} />
            <Text style={textStyle("caption", "primary")}>{campo.prezzoLabel}</Text>
          </View>
        </View>
        <View style={styles.compactArrow}>
          <Icon name="chevron-forward" size={theme.iconSizes.md} color="subtle" />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      {...hoverProps}
      style={({ pressed }) => [
        styles.large,
        webTransition("transform, box-shadow", 220),
        width != null && { width },
        hovered && styles.largeHover,
        pressed && styles.pressed,
        style,
      ]}
    >
      <CampoHero
        tipoHero={campo.tipoHero}
        idSport={campo.idSport}
        photoUrl={campo.urlFotoCopertina}
      >
        <View style={styles.heroScrim} />
        <View style={styles.heroTopRow}>
          <AvailabilityBadge
            state={campo.aperto ? "open" : "closed"}
            label={campo.aperto ? "Aperto" : "Chiuso"}
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
          <PriceTag label={campo.prezzoLabel} />
        </View>
      </CampoHero>
      <View style={styles.largeBody}>
        <Text style={textStyle("bodyStrong", "ink")} numberOfLines={1}>
          {campo.nomeStruttura}
        </Text>
        <View style={styles.rowBetween}>
          <Text style={textStyle("caption", "muted")} numberOfLines={1}>
            {sportLabel(campo.idSport)}
            {campo.superficie ? ` · ${campo.superficie}` : ""}
          </Text>
          <RatingBadge
            value={campo.mediaVoti}
            count={campo.numeroRecensioni}
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
            {campo.distanza
              ? `${campo.distanza} · ${campo.indirizzo}`
              : campo.indirizzo}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * StrutturaCard — contesto secondario (struttura con N campi)
 * ------------------------------------------------------------------ */

export interface StrutturaCardProps {
  struttura: Struttura;
  numeroCampi?: number;
  onPress?: () => void;
  onFav?: () => void;
  isFav?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function StrutturaCard({
  struttura,
  numeroCampi,
  onPress,
  onFav,
  isFav = false,
  style,
}: StrutturaCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.compact,
        pressed && styles.pressed,
        style,
      ]}
    >
      <CampoHero
        tipoHero={struttura.tipoHero}
        idSport={struttura.idSport[0] ?? "padel"}
        photoUrl={struttura.urlFotoCopertina}
        height={76}
        style={styles.compactThumb}
      />
      <View style={styles.compactBody}>
        <Text style={textStyle("bodyStrong", "ink")} numberOfLines={1}>
          {struttura.nome}
        </Text>
        <Text style={textStyle("caption", "muted")} numberOfLines={1}>
          {struttura.distanza
            ? struttura.distanza +
              (numeroCampi != null
                ? ` · ${pluralize(numeroCampi, "campo", "campi")}`
                : "")
            : numeroCampi != null
            ? pluralize(numeroCampi, "campo", "campi")
            : ""}
        </Text>
        <RatingBadge
          value={struttura.mediaVoti}
          count={struttura.numeroRecensioni}
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
 * SportSelectCard — selezione sport nel setup
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
 * TimeOfDayCard — selezione fascia oraria disponibilità
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
 * OptionRow — riga selezione livello (per il futuro setup a 5 step)
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
 * BenefitRow — badge icona + titolo + descrizione
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
 * DetailStat — stat con etichetta piccola
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
 * InfoBanner — riga informativa neutrale
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
 * CheckBadge — disco di successo (sommario / conferma prenotazione)
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
  heroScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(12,14,10,0.08)",
  },

  large: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    overflow: "hidden",
    ...theme.shadows.pop,
  },
  // Hover-only (web): onHoverIn never fires on native, so this is inert there.
  largeHover: {
    transform: [{ translateY: -6 }],
    boxShadow: webElev.hover,
  },
  largeBody: {
    padding: theme.spacing.lg,
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
  // web-only resting elevation (overrides the flat native card shadow); the
  // exact "Campi da provare" cards, no longer flat even without hover.
  compactElev: {
    boxShadow: webElev.rest,
  },
  compactHover: {
    borderColor: theme.colors.ink,
    boxShadow: webElev.hover,
    transform: [{ translateY: -2 }],
  },
  compactThumb: {
    width: 76,
  },
  compactBody: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  compactArrow: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.bg,
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
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
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
