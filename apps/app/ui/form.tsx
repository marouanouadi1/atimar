/**
 * Form & input components. Colors/spacing/typography from @/theme/tokens.
 * RangeSlider is a dependency-free slider built on PanResponder (works on web).
 */

import React, { useCallback, useMemo, useState } from "react";
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import type {
  KeyboardTypeOptions,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from "react-native";
import { theme } from "@/theme/tokens";
import { Icon } from "./primitives";
import { textStyle } from "./theme";

/* ------------------------------------------------------------------ *
 * FormInput
 * ------------------------------------------------------------------ */

export interface FormInputProps {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  label?: string;
  icon?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: React.ComponentProps<typeof TextInput>["autoComplete"];
  style?: StyleProp<ViewStyle>;
}

export function FormInput({
  value,
  onChangeText,
  placeholder,
  label,
  icon,
  error,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = "none",
  autoComplete,
  style,
}: FormInputProps) {
  const [hidden, setHidden] = useState(secureTextEntry);
  const [focused, setFocused] = useState(false);
  const hasError = !!error;
  return (
    <View style={[{ gap: theme.spacing.xs }, style]}>
      {label ? <Text style={textStyle("caption", "text")}>{label}</Text> : null}
      <View
        style={[
          styles.input,
          focused && styles.inputFocused,
          hasError && styles.inputError,
        ]}
      >
        {icon ? (
          <Icon name={icon} size={theme.iconSizes.md} color="subtle" />
        ) : null}
        <TextInput
          style={[styles.inputText, { flex: 1 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.subtle}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Text style={textStyle("caption", "primary")}>
              {hidden ? "Mostra" : "Nascondi"}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        <Text style={textStyle("small", "danger")}>{error}</Text>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * SearchBar — button mode (onPress) or input mode (value/onChangeText)
 * ------------------------------------------------------------------ */

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (v: string) => void;
  onPress?: () => void;
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SearchBar({
  placeholder = "Cerca campi, sport, zone…",
  value,
  onChangeText,
  onPress,
  trailing,
  style,
}: SearchBarProps) {
  const asButton = !!onPress;
  const showClear = !asButton && !!value;

  const inner = (
    <>
      <Icon name="search" size={theme.iconSizes.md} color="subtle" />
      {asButton ? (
        <Text
          style={[textStyle("body", "subtle"), { flex: 1 }]}
          numberOfLines={1}
        >
          {placeholder}
        </Text>
      ) : (
        <TextInput
          style={[styles.inputText, { flex: 1 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.subtle}
          returnKeyType="search"
        />
      )}
      {showClear ? (
        <Pressable onPress={() => onChangeText?.("")} hitSlop={8}>
          <Icon name="close-circle" size={theme.iconSizes.md} color="subtle" />
        </Pressable>
      ) : null}
      {trailing}
    </>
  );

  if (asButton) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.search,
          pressed && styles.pressed,
          style,
        ]}
      >
        {inner}
      </Pressable>
    );
  }
  return <View style={[styles.search, style]}>{inner}</View>;
}

/* ------------------------------------------------------------------ *
 * ToggleRow — label/sub + lime switch
 * ------------------------------------------------------------------ */

export interface ToggleRowProps {
  label: string;
  sub?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

export function ToggleRow({
  label,
  sub,
  value,
  onValueChange,
  icon,
  style,
}: ToggleRowProps) {
  return (
    <View style={[styles.toggleRow, style]}>
      {icon ? (
        <Icon name={icon} size={theme.iconSizes.md} color="muted" />
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={textStyle("bodyStrong", "ink")}>{label}</Text>
        {sub ? <Text style={textStyle("caption", "muted")}>{sub}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          true: theme.colors.lime,
          false: theme.semantic.toggleOff,
        }}
        thumbColor={theme.colors.surface}
        ios_backgroundColor={theme.semantic.toggleOff}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * RangeSlider — dependency-free slider (PanResponder)
 * ------------------------------------------------------------------ */

export interface RangeSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}

export function RangeSlider({
  value,
  min = 1,
  max = 50,
  step = 1,
  disabled = false,
  onChange,
}: RangeSliderProps) {
  const [width, setWidth] = useState(0);
  const range = Math.max(max - min, 1);
  const ratio = Math.min(Math.max((value - min) / range, 0), 1);

  const setFromX = useCallback(
    (x: number) => {
      if (width <= 0) return;
      const r = Math.min(Math.max(x / width, 0), 1);
      let v = min + r * range;
      v = Math.round(v / step) * step;
      v = Math.min(Math.max(v, min), max);
      if (v !== value) onChange(v);
    },
    [width, range, min, max, step, value, onChange],
  );

  // Recreated only when `disabled` or a handler dependency changes; the handlers
  // always close over the latest props, so no stale-closure ref workaround is
  // needed. We rely on `locationX`, not accumulated gesture state, so swapping
  // the responder mid-drag is safe.
  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: (e) => setFromX(e.nativeEvent.locationX),
        onPanResponderMove: (e) => setFromX(e.nativeEvent.locationX),
      }),
    [disabled, setFromX],
  );

  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  return (
    <View
      style={[styles.sliderWrap, disabled && styles.sliderDisabled]}
      onLayout={onLayout}
      {...responder.panHandlers}
    >
      <View style={styles.sliderTrack} />
      <View style={[styles.sliderFill, { width: `${ratio * 100}%` }]} />
      <View style={[styles.sliderThumb, { left: `${ratio * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    height: theme.layout.inputHeight,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.line,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  inputError: {
    borderColor: theme.semantic.danger,
  },
  inputText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.ink,
    paddingVertical: 0,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    height: theme.layout.searchHeight,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  pressed: { opacity: 0.7 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  sliderWrap: {
    height: 36,
    justifyContent: "center",
  },
  sliderDisabled: {
    opacity: 0.45,
  },
  sliderTrack: {
    height: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.placeholder,
  },
  sliderFill: {
    position: "absolute",
    height: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.lime,
  },
  sliderThumb: {
    position: "absolute",
    width: 24,
    height: 24,
    marginLeft: -12,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 3,
    borderColor: theme.colors.lime,
    ...theme.shadows.floatBtn,
  },
});
