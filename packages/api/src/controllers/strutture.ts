import type { Database } from "@atimar/db-types";
import { supabase } from "../client";

type StrutturaInsert = Database["public"]["Tables"]["Strutture"]["Insert"];
type StrutturaUpdate = Database["public"]["Tables"]["Strutture"]["Update"];

export function getStrutture() {
  return supabase.from("Strutture").select("*, Campi(Campi_Sport(fk_sport, Sport(nome_sport)))");
}

export function getStrutturaById(id: number) {
  return supabase.from("Strutture").select("*").eq("id", id).single();
}

export function createStruttura(struttura: StrutturaInsert) {
  return supabase.from("Strutture").insert(struttura).select().single();
}

export function updateStruttura(id: number, updates: StrutturaUpdate) {
  return supabase.from("Strutture").update(updates).eq("id", id).select().single();
}

export function deleteStruttura(id: number) {
  return supabase.from("Strutture").delete().eq("id", id);
}
