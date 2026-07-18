import type { Database } from '@atimar/db-types';
import { getSupabaseClient } from '../client';

type OrarioInsert = Database['public']['Tables']['Orari_Strutture']['Insert'];

export function getOrari() {
  return getSupabaseClient().from('Orari_Strutture').select('*');
}

export function getOrariByStruttura(fkStruttura: number) {
  return getSupabaseClient()
    .from('Orari_Strutture')
    .select('*')
    .eq('fk_struttura', fkStruttura)
    .order('giorno_settimana');
}

export function createOrario(orario: OrarioInsert) {
  return getSupabaseClient()
    .from('Orari_Strutture')
    .insert(orario)
    .select()
    .single();
}

// Inserisce più righe in una volta sola (una per fascia oraria/giorno chiuso).
export function createOrari(orari: OrarioInsert[]) {
  return getSupabaseClient().from('Orari_Strutture').insert(orari).select();
}

// Cancella tutti gli orari di una struttura: usata insieme a createOrari
// per il salvataggio "replace-all" dell'editor settimanale.
export function deleteOrariByStruttura(fkStruttura: number) {
  return getSupabaseClient()
    .from('Orari_Strutture')
    .delete()
    .eq('fk_struttura', fkStruttura);
}
