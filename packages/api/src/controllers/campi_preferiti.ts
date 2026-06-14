import type { Database } from "@atimar/db-types";
import { supabase } from "../client";

type CampoPreperitoInsert = Database["public"]["Tables"]["Campi_Preferiti"]["Insert"];

export function getAllCampiPreferiti() {
  return supabase.from("Campi_Preferiti").select("*");
}

export function getCampiPreferiti(fkProfilo: string) {
  return supabase.from("Campi_Preferiti").select("*").eq("fk_profilo", fkProfilo);
}

export function addCampoPreferito(preferito: CampoPreperitoInsert) {
  return supabase.from("Campi_Preferiti").insert(preferito).select().single();
}

export function removeCampoPreferito(fkProfilo: string, fkCampo: number) {
  return supabase
    .from("Campi_Preferiti")
    .delete()
    .eq("fk_profilo", fkProfilo)
    .eq("fk_campo", fkCampo);
}
