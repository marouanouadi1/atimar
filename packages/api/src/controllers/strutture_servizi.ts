import type { Database } from "@atimar/db-types";
import { supabase } from "../client";

type StrutturaServizioInsert = Database["public"]["Tables"]["Strutture_Servizi"]["Insert"];

export function getStruttureServizi() {
  return supabase.from("Strutture_Servizi").select("*");
}

export function getServiziByStruttura(fkStruttura: number) {
  return supabase
    .from("Strutture_Servizi")
    .select("fk_servizio, Servizi(id, nome_servizio, descrizione)")
    .eq("fk_struttura", fkStruttura);
}

export function addServizioAStruttura(strutturaServizio: StrutturaServizioInsert) {
  return supabase.from("Strutture_Servizi").insert(strutturaServizio).select().single();
}

export function removeServizioDaStruttura(fkStruttura: number, fkServizio: number) {
  return supabase
    .from("Strutture_Servizi")
    .delete()
    .eq("fk_struttura", fkStruttura)
    .eq("fk_servizio", fkServizio);
}
