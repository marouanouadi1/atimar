import type { Database } from '@atimar/db-types';
import { getSupabaseClient } from '../client';

type FotoInsert = Database['public']['Tables']['Foto_Strutture']['Insert'];
type FotoUpdate = Database['public']['Tables']['Foto_Strutture']['Update'];

export function getFoto() {
  return getSupabaseClient().from('Foto_Strutture').select('*').order('ordine');
}

export function getFotoByStruttura(fkStruttura: number) {
  return getSupabaseClient()
    .from('Foto_Strutture')
    .select('*')
    .eq('fk_struttura', fkStruttura)
    .order('ordine');
}

export function createFoto(foto: FotoInsert) {
  return getSupabaseClient()
    .from('Foto_Strutture')
    .insert(foto)
    .select()
    .single();
}

export function updateFoto(id: number, updates: FotoUpdate) {
  return getSupabaseClient()
    .from('Foto_Strutture')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
}

export function deleteFoto(id: number) {
  return getSupabaseClient().from('Foto_Strutture').delete().eq('id', id);
}

export async function setCopertinaFoto(fotoId: number, fkStruttura: number) {
  const { error: resetError } = await getSupabaseClient()
    .from('Foto_Strutture')
    .update({ copertina: false })
    .eq('fk_struttura', fkStruttura);
  if (resetError) return { error: resetError };
  return getSupabaseClient()
    .from('Foto_Strutture')
    .update({ copertina: true })
    .eq('id', fotoId);
}

export async function uploadFotoStruttura(fkStruttura: number, file: File) {
  const ext = file.name.split('.').pop();
  const path = `strutture/${fkStruttura}/${Date.now()}.${ext}`;
  const { error } = await getSupabaseClient()
    .storage.from('foto-strutture')
    .upload(path, file);
  if (error) return { url: null, error };
  const { data } = getSupabaseClient()
    .storage.from('foto-strutture')
    .getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
