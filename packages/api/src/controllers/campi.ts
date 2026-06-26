import type { Database } from '@atimar/db-types';
import { getSupabaseClient } from '../client';

type CampoInsert = Database['public']['Tables']['Campi']['Insert'];
type CampoUpdate = Database['public']['Tables']['Campi']['Update'];

export function getCampi() {
  return getSupabaseClient()
    .from('Campi')
    .select(
      '*, Strutture(nome), Campi_Sport(fk_sport, Sport(nome_sport)), Foto_Campi(*)',
    );
}

export function getCampiByStruttura(fkStruttura: number) {
  return getSupabaseClient()
    .from('Campi')
    .select('*, Foto_Campi(*)')
    .eq('fk_struttura', fkStruttura);
}

export function getCampoById(id: number) {
  return getSupabaseClient().from('Campi').select('*').eq('id', id).single();
}

export function createCampo(campo: CampoInsert) {
  return getSupabaseClient().from('Campi').insert(campo).select().single();
}

export function updateCampo(id: number, updates: CampoUpdate) {
  return getSupabaseClient()
    .from('Campi')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
}

export function deleteCampo(id: number) {
  return getSupabaseClient().from('Campi').delete().eq('id', id);
}
