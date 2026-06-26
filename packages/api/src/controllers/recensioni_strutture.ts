import type { Database } from '@atimar/db-types';
import { getSupabaseClient } from '../client';

type RecensioneInsert =
  Database['public']['Tables']['RecensioniStrutture']['Insert'];
type RecensioneUpdate =
  Database['public']['Tables']['RecensioniStrutture']['Update'];

export function getRecensioni() {
  return getSupabaseClient()
    .from('RecensioniStrutture')
    .select('*')
    .order('created_at', { ascending: false });
}

export function getRecensioniByStruttura(fkStruttura: number) {
  return getSupabaseClient()
    .from('RecensioniStrutture')
    .select('*')
    .eq('fk_struttura', fkStruttura)
    .order('created_at', { ascending: false });
}

export function createRecensione(recensione: RecensioneInsert) {
  return getSupabaseClient()
    .from('RecensioniStrutture')
    .insert(recensione)
    .select()
    .single();
}

export function updateRecensione(id: number, updates: RecensioneUpdate) {
  return getSupabaseClient()
    .from('RecensioniStrutture')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
}

export function deleteRecensione(id: number) {
  return getSupabaseClient().from('RecensioniStrutture').delete().eq('id', id);
}
