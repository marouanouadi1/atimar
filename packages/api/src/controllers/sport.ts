import type { Database } from '@atimar/db-types';
import { getSupabaseClient } from '../client';

type SportInsert = Database['public']['Tables']['Sport']['Insert'];
type SportUpdate = Database['public']['Tables']['Sport']['Update'];

export function getSport() {
  return getSupabaseClient().from('Sport').select('*');
}

export function getSportById(id: number) {
  return getSupabaseClient().from('Sport').select('*').eq('id', id).single();
}

export function createSport(sport: SportInsert) {
  return getSupabaseClient().from('Sport').insert(sport).select().single();
}

export function updateSport(id: number, updates: SportUpdate) {
  return getSupabaseClient()
    .from('Sport')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
}

export function deleteSport(id: number) {
  return getSupabaseClient().from('Sport').delete().eq('id', id);
}
