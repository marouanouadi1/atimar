import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/theme/tokens';
import { BrandMark, isWeb, textStyle, useHover, webTransition } from '@/ui';
import { useAppState } from '@/state/AppState';

const NAV = [
  { label: 'Cerca', route: '/search' },
  { label: 'Strutture', route: '/gestori' },
] as const;

/** Text nav item with a volt underline on hover (web). */
function NavItem({ label, onPress }: { label: string; onPress: () => void }) {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable onPress={onPress} {...hoverProps} style={styles.navItem}>
      <Text style={textStyle('body', 'ink')}>{label}</Text>
      <View style={[styles.navUnderline, webTransition('transform', 160), hovered && styles.navUnderlineOn]} />
    </Pressable>
  );
}

/** Desktop-only navigation header. Returns null on mobile or narrow viewports. */
export function WebHeader() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { user } = useAppState();
  const login = useHover();
  const cta = useHover();

  if (process.env.EXPO_OS !== 'web') return null;

  const isDesktop = width >= theme.breakpoints.desktop;

  return (
    <View style={[styles.bar, isWeb && stickyBar]}>
      <View
        style={[
          styles.inner,
          {
            paddingHorizontal: isDesktop
              ? theme.layout.screenPadDesktop
              : theme.layout.screenPadX,
          },
        ]}
      >
        <Pressable onPress={() => router.push('/')} accessibilityRole="link">
          <BrandMark size={36} />
        </Pressable>

        {isDesktop ? (
          <View style={styles.nav}>
            {NAV.map((item) => (
              <NavItem
                key={item.label}
                label={item.label}
                onPress={() => router.push(item.route as never)}
              />
            ))}
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <View style={styles.actions}>
          {user ? (
            <Pressable
              onPress={() => router.push('/profile')}
              {...login.hoverProps}
              style={[styles.loginBtn, webTransition('background-color', 150), login.hovered && styles.loginBtnHover]}
            >
              <Text style={textStyle('bodyStrong', 'ink')}>{user.name}</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push('/auth/login')}
              {...login.hoverProps}
              style={[styles.loginBtn, webTransition('background-color', 150), login.hovered && styles.loginBtnHover]}
            >
              <Text style={textStyle('bodyStrong', 'ink')}>Accedi</Text>
            </Pressable>
          )}
          {isDesktop && (
            <Pressable
              onPress={() => router.push('/search')}
              {...cta.hoverProps}
              style={[styles.ctaBtn, webTransition('transform, box-shadow', 180), cta.hovered && styles.ctaBtnHover]}
            >
              <Text style={styles.ctaText}>Trova un campo</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

/** Sticky glass bar — web-only style keys not present in RN's ViewStyle type. */
const stickyBar = {
  position: 'sticky',
  top: 0,
  backgroundColor: theme.overlays.glass,
  backdropFilter: 'saturate(140%) blur(12px)',
} as unknown as ViewStyle;

const styles = StyleSheet.create({
  bar: {
    backgroundColor: theme.colors.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.line,
    zIndex: theme.zIndex.header,
    ...theme.shadows.floatBtn,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: theme.layout.maxContent,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: 12,
    gap: theme.spacing.xl,
  },
  nav: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
  },
  navItem: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    gap: 4,
  },
  navUnderline: {
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.lime,
    transform: [{ scaleX: 0 }],
  },
  navUnderlineOn: {
    transform: [{ scaleX: 1 }],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  loginBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: theme.radius.pill,
  },
  loginBtnHover: {
    backgroundColor: theme.colors.chip,
  },
  ctaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radius.pill,
  },
  ctaBtnHover: {
    transform: [{ translateY: -1 }],
    boxShadow: '0 10px 24px rgba(18,20,15,0.28)',
  },
  ctaText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontFamily: theme.fonts.bodyBold,
    letterSpacing: -0.07,
  },
});
