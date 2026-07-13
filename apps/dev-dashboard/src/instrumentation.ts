import { createSupabaseClient, setSupabaseClient } from '@atimar/api'
import { getSupabaseConfig } from '@/lib/supabase-config'

// Le nuove policy RLS su Strutture/Campi (e derivate) limitano la lettura
// pubblica alle sole righe visibili (attivo + verificata + aperto_al_pubblico)
// e non concedono più scrittura ad anon/authenticated. Il dashboard admin deve
// quindi vedere e gestire TUTTO, il che richiede la Secret API key di Supabase
// (bypassa la RLS, è il rimpiazzo della legacy service_role key). `register()`
// gira una sola volta all'avvio del server Next.js, prima che qualunque
// richiesta arrivi, quindi è il punto giusto per inizializzare il singleton
// condiviso da @atimar/api con la secret key invece della publishable key.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!secretKey) {
    throw new Error(
      'SUPABASE_SECRET_KEY non configurata. Aggiungila a apps/dev-dashboard/.env.local ' +
        '(Secret API key del progetto Supabase, formato sb_secret_..., MAI la publishable key: bypassa la RLS ed è riservata al dashboard admin).',
    )
  }

  const { url } = getSupabaseConfig()
  setSupabaseClient(createSupabaseClient({ url, key: secretKey }))
}
