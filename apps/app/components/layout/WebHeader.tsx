import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/theme/tokens';
import { BrandMark, textStyle } from '@/ui';
import { useAppState } from '@/state/AppState';

const NAV = [
  { label: 'Cerca', route: '/search' },
  { label: 'Strutture', route: '/gestori' },
] as const;

/** Desktop-only navigation header. Returns null on mobile or narrow viewports. */
export function WebHeader() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { user } = useAppState();

  if (process.env.EXPO_OS !== 'web') return null;

  const isDesktop = width >= theme.breakpoints.desktop;

  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <Pressable onPress={() => router.push('/')} accessibilityRole="link">
          <BrandMark size={36} />
        </Pressable>

        {isDesktop ? (
          <View style={styles.nav}>
            {NAV.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => router.push(item.route as never)}
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={textStyle('body', 'ink')}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <View style={styles.actions}>
          {user ? (
            <Pressable
              onPress={() => router.push('/profile')}
              style={({ pressed }) => [
                styles.loginBtn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={textStyle('bodyStrong', 'ink')}>{user.name}</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push('/auth/login')}
              style={({ pressed }) => [
                styles.loginBtn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={textStyle('bodyStrong', 'ink')}>Accedi</Text>
            </Pressable>
          )}
          {isDesktop && (
            <Pressable
              onPress={() => router.push('/search')}
              style={({ pressed }) => [
                styles.ctaBtn,
                pressed && styles.ctaBtnPressed,
              ]}
            >
              <Text style={styles.ctaText}>Trova un campo</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

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
    paddingHorizontal: 40,
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
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  loginBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  ctaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radius.pill,
  },
  ctaBtnPressed: {
    opacity: 0.85,
  },
  ctaText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontFamily: theme.fonts.bodyBold,
    letterSpacing: -0.07,
  },
  pressed: {
    opacity: 0.7,
  },
});
