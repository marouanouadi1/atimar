import type { Campo, CampoInLista, Recensione, Struttura } from '@atimar/types';
import { getSupabaseClient } from '../client';
import {
  mapNearbyCampoRowToCampoInLista,
  mapRowToCampo,
  mapRowToRecensione,
  mapRowToStruttura,
  toCampoInLista,
} from '../mappers';
import type {
  CampoRow,
  NearbyCampoRow,
  RecensioneWithProfilo,
  StrutturaWithRelations,
} from '../mappers';

export async function fetchStruttureConCampi() {
  const { data, error } = await getSupabaseClient()
    .from('Strutture')
    .select(
      `id, nome, descrizione, indirizzo, latitudine, longitudine,
       prezzo_orario, sempre_aperto, attivo,
       link_prenotazione_esterno, telefono, link_sito_web,
       Campi (
         id, fk_struttura, nome_campo, tipo_superficie, coperto, prezzo_orario, min_giocatori, max_giocatori, attivo,
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

export async function searchCampiNearby(
  params: {
    lat: number;
    lng: number;
    radiusKm: number;
    sport?: string;
    soloAperti?: boolean;
    limit?: number;
    offset?: number;
  },
) {
  const radiusKm = Math.max(1, params.radiusKm);
  const limit = Math.max(1, Math.min(params.limit ?? 100, 250));
  const offset = Math.max(0, params.offset ?? 0);
  const sport =
    params.sport && params.sport !== 'all' ? params.sport : null;

  // NB: mantenere il binding di `this` al client. Estrarre `.rpc` in una
  // variabile lo scollega dal client e `this.rest` diventa undefined
  // ("Cannot read properties of undefined (reading 'rest')").
  const client = getSupabaseClient();
  const rpc = client.rpc.bind(client) as unknown as (
    fn: 'search_campi_nearby',
    args: Record<string, boolean | number | string | null>,
  ) => Promise<{ data: NearbyCampoRow[] | null; error: { message: string } | null }>;

  const { data, error } = await rpc('search_campi_nearby', {
    p_lat: params.lat,
    p_lng: params.lng,
    p_radius_km: radiusKm,
    p_sport: sport,
    p_solo_aperti: params.soloAperti ?? false,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as NearbyCampoRow[];
  return {
    campiInLista: rows.map(mapNearbyCampoRowToCampoInLista),
    totalCount: rows[0]?.total_count ?? 0,
  };
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
         id, fk_struttura, nome_campo, tipo_superficie, coperto, prezzo_orario, min_giocatori, max_giocatori, attivo,
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
         id, fk_struttura, nome_campo, tipo_superficie, coperto, prezzo_orario, min_giocatori, max_giocatori, attivo,
         Campi_Sport ( fk_campo, fk_sport, Sport ( id, nome_sport, slug ) )
       )`,
    )
    .eq('id', Number(strutturaId))
    .single();

  if (error || !data) return [];

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
