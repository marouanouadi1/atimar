// Le nuove policy RLS su Strutture/Campi (e derivate) limitano la lettura
// pubblica alle sole righe visibili (attivo + verificata + aperto_al_pubblico)
// e non concedono più scrittura ad anon/authenticated. Il dashboard admin deve
// quindi vedere e gestire TUTTO, il che richiede la Secret API key di Supabase
// (bypassa la RLS, è il rimpiazzo della legacy service_role key).
//
// getSupabaseClient() in @atimar/api legge SUPABASE_SECRET_KEY direttamente da
// process.env ad ogni costruzione lazy del client: non va (e non si può)
// impostare qui una volta per tutte, perché Next.js compila instrumentation,
// Server Components, Server Actions e Route Handler come bundle separati, e un
// singleton assegnato in uno di questi non è visibile negli altri. `register()`
// resta solo per fallire in modo esplicito all'avvio se la chiave manca,
// invece di degradare in silenzio alla publishable key (RLS attiva).
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  if (!process.env.SUPABASE_SECRET_KEY) {
    throw new Error(
      'SUPABASE_SECRET_KEY non configurata. Aggiungila a apps/dev-dashboard/.env.local ' +
        '(Secret API key del progetto Supabase, formato sb_secret_..., MAI la publishable key: bypassa la RLS ed è riservata al dashboard admin).',
    )
  }
}
