import type { Database } from '@atimar/db-types';
import { getSupabaseClient } from '../client';

type CampoPreperitoInsert =
  Database['public']['Tables']['Campi_Preferiti']['Insert'];

export function getAllCampiPreferiti() {
  return getSupabaseClient().from('Campi_Preferiti').select('*');
}

export function getCampiPreferiti(fkProfilo: string) {
  return getSupabaseClient()
    .from('Campi_Preferiti')
    .select('*')
    .eq('fk_profilo', fkProfilo);
}

export function addCampoPreferito(preferito: CampoPreperitoInsert) {
  return getSupabaseClient()
    .from('Campi_Preferiti')
    .insert(preferito)
    .select()
    .single();
}

export function removeCampoPreferito(fkProfilo: string, fkCampo: number) {
  return getSupabaseClient()
    .from('Campi_Preferiti')
    .delete()
    .eq('fk_profilo', fkProfilo)
    .eq('fk_campo', fkCampo);
}
