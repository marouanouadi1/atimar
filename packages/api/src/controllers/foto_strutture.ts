import type { Database } from "@atimar/db-types";
import { supabase } from "../client";

type FotoInsert = Database["public"]["Tables"]["Foto_Strutture"]["Insert"];
type FotoUpdate = Database["public"]["Tables"]["Foto_Strutture"]["Update"];

export function getFoto() {
  return supabase.from("Foto_Strutture").select("*").order("ordine");
}

export function getFotoByStruttura(fkStruttura: number) {
  return supabase
    .from("Foto_Strutture")
    .select("*")
    .eq("fk_struttura", fkStruttura)
    .order("ordine");
}

export function createFoto(foto: FotoInsert) {
  return supabase.from("Foto_Strutture").insert(foto).select().single();
}

export function updateFoto(id: number, updates: FotoUpdate) {
  return supabase.from("Foto_Strutture").update(updates).eq("id", id).select().single();
}

export function deleteFoto(id: number) {
  return supabase.from("Foto_Strutture").delete().eq("id", id);
}
