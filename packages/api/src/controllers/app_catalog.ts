import type { Campo, CampoInLista, Recensione, Struttura } from '@atimar/types';
import { getSupabaseClient } from '../client';
import {
  mapRowToCampo,
  mapRowToRecensione,
  mapRowToStruttura,
  toCampoInLista,
} from '../mappers';
import type {
  CampoRow,
  RecensioneWithProfilo,
  StrutturaWithRelations,
} from '../mappers';

export interface CatalogoStrutture {
  strutture: Struttura[];
  campi: Campo[];
  campiInLista: CampoInLista[];
}

export async function fetchStruttureConCampi(): Promise<CatalogoStrutture> {
  const { data, error } = await getSupabaseClient()
    .from('Strutture')
    .select(
      `id, nome, descrizione, indirizzo, latitudine, longitudine,
       prezzo_orario, sempre_aperto, attivo,
       link_prenotazione_esterno, telefono, link_sito_web,
       Campi (
         id, fk_struttura, nome_campo, tipo_superficie, coperto, prezzo_orario, attivo,
         Campi_Sport ( fk_campo, fk_sport, Sport ( id, nome_sport, slug ) )
       ),
       Strutture_Servizi ( Servizi ( id, nome_servizio ) ),
       RecensioniStrutture ( stelle ),
       Foto_Strutture ( url_foto, copertina, ordine )`,
    )
    .eq('attivo', true)
    .order('id');

  if (error) throw error;

  const rows = (data ?? []) as StrutturaWithRelations[];
  const strutture: Struttura[] = [];
  const campi: Campo[] = [];

  for (const row of rows) {
    const struttura = mapRowToStruttura(row);
    strutture.push(struttura);

    row.Campi.filter((campo) => campo.attivo).forEach((campo, i) => {
      campi.push(mapRowToCampo(campo, struttura.sempreAperto, i));
    });
  }

  const strutturaById = Object.fromEntries(strutture.map((s) => [s.id, s]));
  const campiInLista: CampoInLista[] = campi.map((campo) =>
    toCampoInLista(campo, strutturaById[campo.strutturaId]!),
  );

  return { strutture, campi, campiInLista };
}

export async function fetchStrutturaById(id: string): Promise<Struttura | null> {
  if (!id) return null;

  const { data, error } = await getSupabaseClient()
    .from('Strutture')
    .select(
      `id, nome, descrizione, indirizzo, latitudine, longitudine,
       prezzo_orario, sempre_aperto, attivo,
       link_prenotazione_esterno, telefono, link_sito_web,
       Campi (
         id, fk_struttura, nome_campo, tipo_superficie, coperto, prezzo_orario, attivo,
         Campi_Sport ( fk_campo, fk_sport, Sport ( id, nome_sport, slug ) )
       ),
       Strutture_Servizi ( Servizi ( id, nome_servizio ) ),
       RecensioniStrutture ( stelle ),
       Foto_Strutture ( url_foto, copertina, ordine )`,
    )
    .eq('id', Number(id))
    .eq('attivo', true)
    .single();

  if (error || !data) return null;
  return mapRowToStruttura(data as StrutturaWithRelations);
}

export async function fetchCampiByStruttura(strutturaId: string): Promise<Campo[]> {
  if (!strutturaId) return [];

  const { data, error } = await getSupabaseClient()
    .from('Strutture')
    .select(
      `sempre_aperto,
       Campi (
         id, fk_struttura, nome_campo, tipo_superficie, coperto, prezzo_orario, attivo,
         Campi_Sport ( fk_campo, fk_sport, Sport ( id, nome_sport, slug ) )
       )`,
    )
    .eq('id', Number(strutturaId))
    .single();

  if (error || !data) return [];

  // sempre_aperto is NOT NULL after migration 20260627000002.
  const row = data as { sempre_aperto: boolean; Campi: CampoRow[] };
  const strutturaAperta = row.sempre_aperto;

  return row.Campi.filter((campo) => campo.attivo).map((campo, i) =>
    mapRowToCampo(campo, strutturaAperta, i),
  );
}

export async function fetchRecensioniByStruttura(strutturaId: string): Promise<Recensione[]> {
  if (!strutturaId) return [];

  const { data, error } = await getSupabaseClient()
    .from('RecensioniStrutture')
    .select(
      'id, fk_struttura, fk_profilo, stelle, commento, created_at, Profili ( nome_completo )',
    )
    .eq('fk_struttura', Number(strutturaId))
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as RecensioneWithProfilo[]).map(mapRowToRecensione);
}

export interface FavoriteRow {
  fk_campo: number;
  fk_profilo: string;
  created_at: string;
  aggiornato_il: string;
}

export async function fetchFavorites(profileId: string): Promise<FavoriteRow[]> {
  const { data, error } = await getSupabaseClient()
    .from('Campi_Preferiti')
    .select('fk_campo, fk_profilo, created_at, aggiornato_il')
    .eq('fk_profilo', profileId);

  if (error) throw error;
  return (data ?? []) as FavoriteRow[];
}

export async function addFavorite(
  profileId: string,
  campoId: number,
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('Campi_Preferiti')
    .upsert(
      { fk_profilo: profileId, fk_campo: campoId },
      { onConflict: 'fk_profilo,fk_campo' },
    );

  if (error) throw error;
}

export async function removeFavorite(
  profileId: string,
  campoId: number,
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('Campi_Preferiti')
    .delete()
    .eq('fk_profilo', profileId)
    .eq('fk_campo', campoId);

  if (error) throw error;
}
