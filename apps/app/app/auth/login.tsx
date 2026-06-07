import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { AuthLayout, Button, FormInput, textStyle } from "@/ui";
import { useAppState } from "@/state/AppState";
import type { AuthField } from "@/state/auth";

export default function Login() {
  const router = useRouter();
  const { login } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<AuthField, string>>>({});

  const onSubmit = () => {
    const result = login({ email, password });
    setErrors(result.errors);
    if (result.ok) router.replace("/home");
  };

  const onSocial = (provider: "google" | "apple") => {
    const result = login({
      email: `${provider}@atimar.app`,
      password: "social-mock",
    });
    if (result.ok) router.replace("/home");
  };

  return (
    <AuthLayout
      title="Bentornato"
      subtitle="Accedi per continuare a giocare."
      onBack={() => router.back()}
      onSocial={onSocial}
      footer={
        <View style={styles.footer}>
          <Button icon onPress={onSubmit}>
            Accedi
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
      <Pressable hitSlop={8} style={styles.forgot}>
        <Text style={textStyle("caption", "primary")}>
          Password dimenticata?
        </Text>
      </Pressable>
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
  forgot: { alignSelf: "flex-end" },
});
