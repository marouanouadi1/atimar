import { getSupabaseClient } from '../client';

export function getCitta() {
  return getSupabaseClient().from('Citta').select('id, nome').order('nome');
}

export function getCittaById(id: number) {
  return getSupabaseClient().from('Citta').select('id, nome').eq('id', id).single();
}

export function searchCitta(query: string, limit = 50) {
  const q = getSupabaseClient().from('Citta').select('id, nome').order('nome').limit(limit);
  return query.trim() ? q.ilike('nome', `%${query.trim()}%`) : q;
}
