import { useState } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { AuthLayout, Button, FormInput, textStyle } from "@/ui";
import { useAppState } from "@/state/AppState";
import type { AuthField } from "@/state/auth";

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<AuthField, string>>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | undefined>(undefined);

  const onSubmit = async () => {
    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);
    setErrors(result.errors);
    if (result.ok) router.replace("/home");
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setGoogleError(undefined);
    const result = await loginWithGoogle();
    setGoogleLoading(false);
    if (!result.ok) {
      setGoogleError(result.error ?? "Accesso Google non riuscito");
    } else {
      // On native: session is set, navigate to home.
      // On web: page has already redirected — this line is unreachable.
      router.replace("/home");
    }
  };

  return (
    <AuthLayout
      title="Bentornato"
      subtitle="Accedi per continuare a giocare."
      withHero
      onBack={() => router.back()}
      onSocial={(p) => { if (p === "google" && !googleLoading) void handleGoogle(); }}
      socialError={googleError}
      footer={
        <View style={styles.footer}>
          <Button icon onPress={onSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.surface} />
            ) : (
              "Accedi"
            )}
          </Button>
          <View style={styles.switchRow}>
            <Text style={textStyle("caption", "muted")}>
              Non hai un account?
            </Text>
            <Pressable
              onPress={() => router.replace("/auth/register")}
              hitSlop={8}
            >
              <Text style={textStyle("caption", "primary")}>Registrati</Text>
            </Pressable>
          </View>
        </View>
      }
    >
      <FormInput
        label="Email"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="nome@email.com"
        keyboardType="email-address"
        autoComplete="email"
        error={errors.email}
      />
      <FormInput
        label="Password"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        placeholder="La tua password"
        secureTextEntry
        autoComplete="password"
        error={errors.password}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  footer: { gap: theme.spacing.md },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
});
