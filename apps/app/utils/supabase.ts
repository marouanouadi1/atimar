import { createSupabaseClient } from '@atimar/api';

// Compatibility wrapper for the parked Supabase auth sample components.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createSupabaseClient({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
}) as any;
