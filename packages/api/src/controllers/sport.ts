import type { Database } from "@atimar/db-types";
import { supabase } from "../client";

type SportInsert = Database["public"]["Tables"]["Sport"]["Insert"];
type SportUpdate = Database["public"]["Tables"]["Sport"]["Update"];

export function getSport() {
  return supabase.from("Sport").select("*");
}

export function getSportById(id: number) {
  return supabase.from("Sport").select("*").eq("id", id).single();
}

export function createSport(sport: SportInsert) {
  return supabase.from("Sport").insert(sport).select().single();
}

export function updateSport(id: number, updates: SportUpdate) {
  return supabase.from("Sport").update(updates).eq("id", id).select().single();
}

export function deleteSport(id: number) {
  return supabase.from("Sport").delete().eq("id", id);
}
