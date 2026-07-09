/**
 * Auth helpers — Supabase-backed sign-in / sign-up / sign-out / OAuth.
 *
 * Field validation happens client-side before the network call so we keep
 * the immediate feedback the UI was already providing.
 */

import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import type { User } from "@atimar/types";
import { supabase } from "@/data/client";

export type AuthField = "name" | "email" | "password";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  ok: boolean;
  errors: Partial<Record<AuthField, string>>;
  user?: User;
}

/* ------------------------------------------------------------------ *
 * Client-side field validators (no network)                           *
 * ------------------------------------------------------------------ */

function isEmail(value: string): boolean {
  const v = value.trim();
  return v.includes("@") && v.indexOf("@") > 0 && v.indexOf("@") < v.length - 1;
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0]?.split(/[.\-_]/)[0] ?? "Atleta";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function validateRegisterFields(input: RegisterInput): AuthResult | null {
  const errors: AuthResult["errors"] = {};
  if (!input.name.trim()) errors.name = "Inserisci il tuo nome";
  if (!isEmail(input.email)) errors.email = "Email non valida";
  if (input.password.length < 6) errors.password = "Minimo 6 caratteri";
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return null;
}

function validateLoginFields(input: LoginInput): AuthResult | null {
  const errors: AuthResult["errors"] = {};
  if (!isEmail(input.email)) errors.email = "Email non valida";
  if (input.password.length < 4) errors.password = "Minimo 4 caratteri";
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return null;
}

/* ------------------------------------------------------------------ *
 * Supabase auth operations                                            *
 * ------------------------------------------------------------------ */

export async function signIn(input: LoginInput): Promise<AuthResult> {
  const fieldErr = validateLoginFields(input);
  if (fieldErr) return fieldErr;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  });

  if (error) {
    const msg =
      error.message.includes("Invalid login")
        ? "Email o password non corretti"
        : error.message;
    return { ok: false, errors: { email: msg } };
  }

  const u = data.user;
  return {
    ok: true,
    errors: {},
    user: {
      name:
        u.user_metadata?.full_name ??
        u.user_metadata?.name ??
        nameFromEmail(u.email ?? ""),
      email: u.email ?? input.email.trim(),
    },
  };
}

export async function signUp(input: RegisterInput): Promise<AuthResult> {
  const fieldErr = validateRegisterFields(input);
  if (fieldErr) return fieldErr;

  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: { data: { full_name: input.name.trim() } },
  });

  if (error) {
    const msg = error.message.includes("already registered")
      ? "Email già registrata"
      : error.message;
    return { ok: false, errors: { email: msg } };
  }

  return {
    ok: true,
    errors: {},
    user: { name: input.name.trim(), email: input.email.trim() },
  };
}

export function signOut(): void {
  void supabase.auth.signOut();
}

/* ------------------------------------------------------------------ *
 * Google OAuth — web-redirect (web) + system browser PKCE (native)   *
 * ------------------------------------------------------------------ */

export interface OAuthResult {
  ok: boolean;
  /** Set when ok is false and an actionable message is available. */
  error?: string;
}

export async function signInWithGoogle(): Promise<OAuthResult> {
  if (Platform.OS === "web") {
    // Full-page redirect: Supabase redirects to Google, then back to our origin.
    // detectSessionInUrl: true (set in client.ts for web) picks up the session
    // automatically on the redirect return page.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    if (error) return { ok: false, error: error.message };
    // Success: window.location.assign() was just called and the browser is
    // navigating to Google right now, but that navigation is asynchronous —
    // JS keeps running until the new page actually loads. Never resolve here,
    // otherwise the caller's `router.replace(...)` runs first and flashes the
    // current screen (e.g. the home page) before Google's form appears.
    return new Promise<OAuthResult>(() => {});
  }

  // Native: open Google login in the system browser, capture the redirect,
  // and exchange the PKCE code for a session.
  const redirectTo = Linking.createURL("auth/callback");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error || !data.url) {
    return { ok: false, error: error?.message ?? "Impossibile avviare il login Google" };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== "success") {
    // User cancelled or browser error — not an error we need to surface
    return { ok: false };
  }

  const parsed = Linking.parse(result.url);
  const code = parsed.queryParams?.code;
  if (typeof code !== "string" || !code) {
    return { ok: false, error: "Codice di autorizzazione non trovato" };
  }

  const { error: exchErr } = await supabase.auth.exchangeCodeForSession(code);
  if (exchErr) return { ok: false, error: exchErr.message };

  return { ok: true };
}
