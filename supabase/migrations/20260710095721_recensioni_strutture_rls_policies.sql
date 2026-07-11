-- RecensioniStrutture ha ENABLE ROW LEVEL SECURITY dalla migration iniziale
-- ma non aveva alcuna policy: con RLS attiva e zero policy, Postgres nega
-- di default SELECT/INSERT/UPDATE/DELETE per "authenticated"/"anon", il che
-- causava il fallimento del salvataggio delle recensioni dall'app.

-- Lettura pubblica: le recensioni sono contenuto pubblico mostrato sulla scheda struttura
CREATE POLICY "Lettura pubblica recensioni"
  ON "public"."RecensioniStrutture"
  FOR SELECT TO "authenticated", "anon"
  USING (true);

-- Un utente crea solo recensioni a proprio nome
CREATE POLICY "Utenti possono creare recensioni proprie"
  ON "public"."RecensioniStrutture"
  FOR INSERT TO "authenticated"
  WITH CHECK (("auth"."uid"() = "fk_profilo"));

-- Un utente aggiorna solo le proprie recensioni
CREATE POLICY "Utenti possono aggiornare recensioni proprie"
  ON "public"."RecensioniStrutture"
  FOR UPDATE TO "authenticated"
  USING (("auth"."uid"() = "fk_profilo"))
  WITH CHECK (("auth"."uid"() = "fk_profilo"));

-- Un utente elimina solo le proprie recensioni (parità con deleteRecensione)
CREATE POLICY "Utenti possono eliminare recensioni proprie"
  ON "public"."RecensioniStrutture"
  FOR DELETE TO "authenticated"
  USING (("auth"."uid"() = "fk_profilo"));
