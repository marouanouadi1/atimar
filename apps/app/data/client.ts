/**
 * App-specific Supabase client — includes AsyncStorage for session persistence
 * across native (iOS/Android) and web (localStorage via react-native-web).
 *
 * The shared @atimar/api data functions use this client after bootstrapping, so
 * authenticated reads and writes keep the current RLS/session context.
 */

import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { setSupabaseClient } from "@atimar/api";
import type { Database } from "@atimar/db-types";

const url =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";

const anonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  (process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  "";

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // On web, Supabase needs to detect the session from the OAuth redirect URL.
    // On native we exchange the code manually via WebBrowser + exchangeCodeForSession.
    detectSessionInUrl: Platform.OS === "web",
    flowType: "pkce",
  },
});

setSupabaseClient(supabase);
