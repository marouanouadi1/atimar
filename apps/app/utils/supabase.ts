import { supabase as apiSupabase } from "@atimar/api";

// Compatibility wrapper for the parked Supabase auth sample components.
export const supabase = apiSupabase as any;
