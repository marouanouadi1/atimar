import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@atimar/db-types';

const PLACEHOLDER_SUPABASE_HOST = 'placeholder.supabase.co';

export type AtimarSupabaseClient = SupabaseClient<Database>;

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

type SupabaseEnv = Partial<
  Record<
    | 'EXPO_PUBLIC_SUPABASE_URL'
    | 'EXPO_PUBLIC_SUPABASE_ANON_KEY'
    | 'NEXT_PUBLIC_SUPABASE_URL'
    | 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    string
  >
>;

let cachedSupabase: AtimarSupabaseClient | null = null;

export function validateSupabaseConfig(config: SupabaseConfig): SupabaseConfig {
  const rawUrl = config.url.trim();
  const anonKey = config.anonKey.trim();

  if (!rawUrl || !anonKey) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY for the current app.',
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new Error(
      'Invalid Supabase configuration. The Supabase URL must be a full URL like https://your-project.supabase.co.',
    );
  }

  if (parsedUrl.hostname === PLACEHOLDER_SUPABASE_HOST) {
    throw new Error(
      'Invalid Supabase configuration. The Supabase URL is still set to placeholder.supabase.co.',
    );
  }

  if (parsedUrl.pathname !== '/') {
    throw new Error(
      'Invalid Supabase configuration. The Supabase URL must be the project root URL, not a REST endpoint.',
    );
  }

  return {
    url: parsedUrl.origin,
    anonKey,
  };
}

export function getSupabaseConfigFromEnv(env?: SupabaseEnv): SupabaseConfig {
  const supabaseUrl =
    env?.EXPO_PUBLIC_SUPABASE_URL ??
    env?.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    '';
  const supabaseAnonKey =
    env?.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL/EXPO_PUBLIC_SUPABASE_ANON_KEY for Expo or NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY for Next.',
    );
  }

  return validateSupabaseConfig({
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  });
}

export function createSupabaseClient(
  config: SupabaseConfig,
): AtimarSupabaseClient {
  const { url, anonKey } = validateSupabaseConfig(config);
  return createClient<Database>(url, anonKey);
}

export function setSupabaseClient(client: AtimarSupabaseClient | null) {
  cachedSupabase = client;
}

export function getSupabaseClient() {
  if (!cachedSupabase) {
    cachedSupabase = createSupabaseClient(getSupabaseConfigFromEnv());
  }

  return cachedSupabase;
}
