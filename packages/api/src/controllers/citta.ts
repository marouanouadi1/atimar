import { getSupabaseClient } from '../client';

export function getCitta() {
  return getSupabaseClient().from('Citta').select('id, nome').order('nome');
}
