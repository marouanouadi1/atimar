import type { Database } from "@atimar/db-types";
import { supabase } from "../client";

type PreferenzaInsert = Database["public"]["Tables"]["Preferenze_Sport_Utente"]["Insert"];

export function getAllPreferenzeSport() {
  return supabase.from("Preferenze_Sport_Utente").select("*");
}

export function getPreferenzeSportUtente(fkProfilo: string) {
  return supabase
    .from("Preferenze_Sport_Utente")
    .select("*")
    .eq("fk_profilo", fkProfilo);
}

export function addPreferenzaSport(preferenza: PreferenzaInsert) {
  return supabase.from("Preferenze_Sport_Utente").insert(preferenza).select().single();
}

export function removePreferenzaSport(fkProfilo: string, fkSport: number) {
  return supabase
    .from("Preferenze_Sport_Utente")
    .delete()
    .eq("fk_profilo", fkProfilo)
    .eq("fk_sport", fkSport);
}
