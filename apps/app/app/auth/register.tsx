import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";
import { AuthLayout, Button, FormInput, textStyle } from "@/ui";
import { useAppState } from "@/state/AppState";
import type { AuthField } from "@/state/auth";

export default function Register() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAppState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<AuthField, string>>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | undefined>(undefined);

  const onSubmit = async () => {
    setLoading(true);
    const result = await register({ name, email, password });
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
      router.replace("/home");
    }
  };

  return (
    <AuthLayout
      title="Crea il tuo account"
      subtitle="Inizia a trovare campi e a giocare di più."
      withHero
      onBack={() => router.back()}
      onSocial={(p) => { if (p === "google" && !googleLoading) void handleGoogle(); }}
      socialError={googleError}
      footer={
        <View style={styles.footer}>
          <Button icon loading={loading} onPress={onSubmit} disabled={loading}>
            Registrati
          </Button>
          <View style={styles.switchRow}>
            <Text style={textStyle("caption", "muted")}>
              Hai già un account?
            </Text>
            <Pressable
              onPress={() => router.replace("/auth/login")}
              hitSlop={8}
            >
              <Text style={textStyle("caption", "primary")}>Accedi</Text>
            </Pressable>
          </View>
        </View>
      }
    >
      <FormInput
        label="Nome"
        icon="person-outline"
        value={name}
        onChangeText={setName}
        placeholder="Come ti chiami?"
        autoCapitalize="words"
        autoComplete="name"
        error={errors.name}
      />
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
        placeholder="Almeno 6 caratteri"
        secureTextEntry
        autoComplete="password-new"
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
