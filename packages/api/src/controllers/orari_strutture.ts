import type { Database } from '@atimar/db-types';
import { getSupabaseClient } from '../client';

type OrarioInsert = Database['public']['Tables']['Orari_Strutture']['Insert'];
type OrarioUpdate = Database['public']['Tables']['Orari_Strutture']['Update'];

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

export function updateOrario(
  fkStruttura: number,
  giornoSettimana: number,
  updates: OrarioUpdate,
) {
  return getSupabaseClient()
    .from('Orari_Strutture')
    .update(updates)
    .eq('fk_struttura', fkStruttura)
    .eq('giorno_settimana', giornoSettimana)
    .select()
    .single();
}

export function deleteOrario(fkStruttura: number, giornoSettimana: number) {
  return getSupabaseClient()
    .from('Orari_Strutture')
    .delete()
    .eq('fk_struttura', fkStruttura)
    .eq('giorno_settimana', giornoSettimana);
}
