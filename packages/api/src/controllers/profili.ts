import type { Database } from "@atimar/db-types";
import { supabase } from "../client";

type ProfiloInsert = Database["public"]["Tables"]["Profili"]["Insert"];
type ProfiloUpdate = Database["public"]["Tables"]["Profili"]["Update"];

export function getProfili() {
  return supabase.from("Profili").select("*");
}

export function getProfiloById(id: string) {
  return supabase.from("Profili").select("*").eq("id", id).single();
}

export function createProfilo(profilo: ProfiloInsert) {
  return supabase.from("Profili").insert(profilo).select().single();
}

export function updateProfilo(id: string, updates: ProfiloUpdate) {
  return supabase.from("Profili").update(updates).eq("id", id).select().single();
}

export function deleteProfilo(id: string) {
  return supabase.from("Profili").delete().eq("id", id);
}
