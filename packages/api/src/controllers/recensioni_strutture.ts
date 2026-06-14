import type { Database } from "@atimar/db-types";
import { supabase } from "../client";

type RecensioneInsert = Database["public"]["Tables"]["RecensioniStrutture"]["Insert"];
type RecensioneUpdate = Database["public"]["Tables"]["RecensioniStrutture"]["Update"];

export function getRecensioni() {
  return supabase.from("RecensioniStrutture").select("*").order("created_at", { ascending: false });
}

export function getRecensioniByStruttura(fkStruttura: number) {
  return supabase
    .from("RecensioniStrutture")
    .select("*")
    .eq("fk_struttura", fkStruttura)
    .order("created_at", { ascending: false });
}

export function createRecensione(recensione: RecensioneInsert) {
  return supabase.from("RecensioniStrutture").insert(recensione).select().single();
}

export function updateRecensione(id: number, updates: RecensioneUpdate) {
  return supabase
    .from("RecensioniStrutture")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
}

export function deleteRecensione(id: number) {
  return supabase.from("RecensioniStrutture").delete().eq("id", id);
}
