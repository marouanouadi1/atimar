import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@atimar/db-types';

const PLACEHOLDER_SUPABASE_HOST = 'placeholder.supabase.co';

export type AtimarSupabaseClient = SupabaseClient<Database>;

export type SupabaseConfig = {
  url: string;
  key: string;
};

type SupabaseEnv = Partial<
  Record<
    | 'EXPO_PUBLIC_SUPABASE_URL'
    | 'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
    | 'NEXT_PUBLIC_SUPABASE_URL'
    | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
    | 'SUPABASE_SECRET_KEY',
    string
  >
>;

let cachedSupabase: AtimarSupabaseClient | null = null;

export function validateSupabaseConfig(config: SupabaseConfig): SupabaseConfig {
  const rawUrl = config.url.trim();
  const key = config.key.trim();

  if (!rawUrl || !key) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY for the current app.',
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
    key,
  };
}

export function getSupabaseConfigFromEnv(env?: SupabaseEnv): SupabaseConfig {
  const source = env ?? (typeof process !== 'undefined' ? process.env : {});
  const supabaseUrl =
    source.EXPO_PUBLIC_SUPABASE_URL ?? source.NEXT_PUBLIC_SUPABASE_URL ?? '';
  // SUPABASE_SECRET_KEY (server-only, mai esposta a un bundle client) ha la
  // priorità: bypassa la RLS ed è quella richiesta dal dashboard admin. Va
  // letta qui, ad ogni costruzione lazy del client, e non impostata una tantum
  // altrove (es. instrumentation.ts) perché Next.js compila instrumentation,
  // Server Components, Server Actions e Route Handler come bundle separati:
  // un singleton assegnato in uno di questi non è visibile negli altri, mentre
  // process.env è condiviso da tutto il processo Node.
  const supabaseKey =
    source.SUPABASE_SECRET_KEY ??
    source.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    source.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    '';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL/EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY for Expo or NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for Next.',
    );
  }

  return validateSupabaseConfig({
    url: supabaseUrl,
    key: supabaseKey,
  });
}

export function createSupabaseClient(
  config: SupabaseConfig,
): AtimarSupabaseClient {
  const { url, key } = validateSupabaseConfig(config);
  return createClient<Database>(url, key);
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
