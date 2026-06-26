import type { Database } from "@atimar/db-types";
import { supabase } from "../client";

type CampoInsert = Database["public"]["Tables"]["Campi"]["Insert"];
type CampoUpdate = Database["public"]["Tables"]["Campi"]["Update"];

export function getCampi() {
  return supabase.from("Campi").select("*, Strutture(nome), Campi_Sport(fk_sport, Sport(nome_sport))")
}

export function getCampiByStruttura(fkStruttura: number) {
  return supabase.from("Campi").select("*").eq("fk_struttura", fkStruttura);
}

export function getCampoById(id: number) {
  return supabase.from("Campi").select("*").eq("id", id).single();
}

export function createCampo(campo: CampoInsert) {
  return supabase.from("Campi").insert(campo).select().single();
}

export function updateCampo(id: number, updates: CampoUpdate) {
  return supabase.from("Campi").update(updates).eq("id", id).select().single();
}

export function deleteCampo(id: number) {
  return supabase.from("Campi").delete().eq("id", id);
}
