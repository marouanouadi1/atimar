import type { Database } from '@atimar/db-types';
import { getSupabaseClient } from '../client';

type ServizioInsert = Database['public']['Tables']['Servizi']['Insert'];
type ServizioUpdate = Database['public']['Tables']['Servizi']['Update'];

export function getServizi() {
  return getSupabaseClient().from('Servizi').select('*');
}

export function getServizioById(id: number) {
  return getSupabaseClient().from('Servizi').select('*').eq('id', id).single();
}

export function createServizio(servizio: ServizioInsert) {
  return getSupabaseClient().from('Servizi').insert(servizio).select().single();
}

export function updateServizio(id: number, updates: ServizioUpdate) {
  return getSupabaseClient()
    .from('Servizi')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
}

export function deleteServizio(id: number) {
  return getSupabaseClient().from('Servizi').delete().eq('id', id);
}
