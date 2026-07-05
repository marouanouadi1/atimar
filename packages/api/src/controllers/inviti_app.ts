import type { Database } from '@atimar/db-types';
import { getSupabaseClient } from '../client';

type InvitoAppInsert = Database['public']['Tables']['Inviti_App']['Insert'];

export function getInviteByProfile(profileId: string) {
  return getSupabaseClient()
    .from('Inviti_App')
    .select('*')
    .eq('fk_profilo', profileId)
    .maybeSingle();
}

export function upsertInviteForProfile(invito: InvitoAppInsert) {
  return getSupabaseClient()
    .from('Inviti_App')
    .upsert(invito, { onConflict: 'fk_profilo' })
    .select()
    .single();
}

export async function markInviteShared(profileId: string, codice: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('Inviti_App')
    .select('conteggio_condivisioni')
    .eq('fk_profilo', profileId)
    .eq('codice', codice)
    .single();

  if (error) return { data: null, error };

  return client
    .from('Inviti_App')
    .update({
      conteggio_condivisioni: (data?.conteggio_condivisioni ?? 0) + 1,
      ultimo_condiviso_il: new Date().toISOString(),
      aggiornato_il: new Date().toISOString(),
    })
    .eq('fk_profilo', profileId)
    .eq('codice', codice)
    .select()
    .single();
}
