import type { Database } from '@atimar/db-types';
import { getSupabaseClient } from '../client';

type FotoCampoInsert = Database['public']['Tables']['Foto_Campi']['Insert'];
type FotoCampoUpdate = Database['public']['Tables']['Foto_Campi']['Update'];

export function getFotoCampi() {
  return getSupabaseClient().from('Foto_Campi').select('*').order('ordine');
}

export function getFotoByCampo(fkCampo: number) {
  return getSupabaseClient()
    .from('Foto_Campi')
    .select('*')
    .eq('fk_campo', fkCampo)
    .order('ordine');
}

export function createFotoCampo(foto: FotoCampoInsert) {
  return getSupabaseClient().from('Foto_Campi').insert(foto).select().single();
}

export function updateFotoCampo(id: number, updates: FotoCampoUpdate) {
  return getSupabaseClient()
    .from('Foto_Campi')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
}

export function deleteFotoCampo(id: number) {
  return getSupabaseClient().from('Foto_Campi').delete().eq('id', id);
}

export async function setCopertinaFotoCampo(fotoId: number, fkCampo: number) {
  const { error: resetError } = await getSupabaseClient()
    .from('Foto_Campi')
    .update({ copertina: false })
    .eq('fk_campo', fkCampo);
  if (resetError) return { error: resetError };
  return getSupabaseClient()
    .from('Foto_Campi')
    .update({ copertina: true })
    .eq('id', fotoId);
}

export async function uploadFotoCampo(fkCampo: number, file: File) {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `campi/${fkCampo}/${Date.now()}.${ext}`;
  const { error } = await getSupabaseClient()
    .storage.from('foto-campi')
    .upload(path, file);
  if (error) return { url: null, error };
  const { data } = getSupabaseClient()
    .storage.from('foto-campi')
    .getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
