import type { Database } from "@atimar/db-types";
import { supabase } from "../client";

type CampoSportInsert = Database["public"]["Tables"]["Campi_Sport"]["Insert"];
type CampoSportUpdate = Database["public"]["Tables"]["Campi_Sport"]["Update"];

export function getSportByCampo(fkCampo: number) {
  return supabase.from("Campi_Sport").select("*").eq("fk_campo", fkCampo);
}

export function addSportACampo(campoSport: CampoSportInsert) {
  return supabase.from("Campi_Sport").insert(campoSport).select().single();
}

export function updateSportCampo(fkCampo: number, fkSport: number, updates: CampoSportUpdate) {
  return supabase
    .from("Campi_Sport")
    .update(updates)
    .eq("fk_campo", fkCampo)
    .eq("fk_sport", fkSport)
    .select()
    .single();
}

export function removeSportDaCampo(fkCampo: number, fkSport: number) {
  return supabase
    .from("Campi_Sport")
    .delete()
    .eq("fk_campo", fkCampo)
    .eq("fk_sport", fkSport);
}
