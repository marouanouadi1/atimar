import { supabase } from "../client";

export function getCitta() {
  return supabase.from("Citta").select("id, nome").order("nome");
}
