export {
  createSupabaseClient,
  getSupabaseClient,
  getSupabaseConfigFromEnv,
  setSupabaseClient,
  validateSupabaseConfig,
  type AtimarSupabaseClient,
  type SupabaseConfig,
} from './client';
export * from './controllers/citta';
export * from './controllers/strutture';
export * from './controllers/servizi';
export * from './controllers/strutture_servizi';
export * from './controllers/campi';
export * from './controllers/campi_preferiti';
export * from './controllers/campi_sport';
export * from './controllers/sport';
export * from './controllers/profili';
export * from './controllers/preferenze_sport_utente';
export * from './controllers/foto_campi';
export * from './controllers/foto_strutture';
export * from './controllers/orari_strutture';
export * from './controllers/recensioni_strutture';
