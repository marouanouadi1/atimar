-- Non tutte le strutture (e quindi i loro campi) sono aperte al pubblico: serve
-- un flag esplicito per distinguerle. Il flag è pensato come filtro di ricerca
-- lato app, attivo di default (l'utente può disattivarlo per vedere anche le
-- strutture non aperte al pubblico) — NON come cancello di sicurezza: quel
-- ruolo resta ad "attivo" e "verificata".
--
-- In aggiunta: le policy RLS "admin full access" USING(true) (senza clausola TO)
-- permettevano finora a chiunque avesse la anon key — quindi anche all'app
-- pubblica — di leggere/scrivere qualunque riga di Strutture/Campi e derivate,
-- aggirando qualsiasi filtro applicativo. Vengono sostituite con policy di sola
-- lettura per anon/authenticated, ristrette alle strutture "visibili"
-- (attivo AND verificata). Le scritture (dashboard admin) passano da qui in
-- poi dalla service_role key, che bypassa RLS.
--
-- Le istruzioni sotto sono scritte in modo idempotente (IF EXISTS/IF NOT
-- EXISTS, DROP prima di CREATE) così da poter girare sia su un database
-- pulito sia per riallineare un database su cui una versione precedente di
-- questa stessa migration fosse già stata applicata.

-- 1. Colonna aperto_al_pubblico -------------------------------------------------

ALTER TABLE "public"."Strutture"
  ADD COLUMN IF NOT EXISTS "aperto_al_pubblico" boolean NOT NULL DEFAULT false;

-- Backfill: i dati già presenti erano già mostrati in app, quindi sono disponibili.
UPDATE "public"."Strutture" SET "aperto_al_pubblico" = true;

-- 2. RPC search_campi_nearby — filtro esplicito, parametro p_solo_pubblico e
--    colonna di ritorno aperto_al_pubblico -------------------------------------
-- Cambia sia l'elenco degli argomenti che le colonne di ritorno rispetto alla
-- versione 20260710164916, quindi va ricreata da zero (CREATE OR REPLACE non
-- ammette di cambiare né l'uno né le altre). Il primo DROP copre chi parte da
-- un database pulito (dove esiste ancora la versione a 7 argomenti); il
-- secondo copre chi riallinea un database su cui la versione a 8 argomenti
-- senza aperto_al_pubblico fosse già stata applicata.

DROP FUNCTION IF EXISTS "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text", "p_solo_aperti" boolean, "p_limit" integer, "p_offset" integer);
DROP FUNCTION IF EXISTS "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text", "p_solo_aperti" boolean, "p_limit" integer, "p_offset" integer, "p_solo_pubblico" boolean);

CREATE FUNCTION "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text" DEFAULT NULL::"text", "p_solo_aperti" boolean DEFAULT false, "p_limit" integer DEFAULT 100, "p_offset" integer DEFAULT 0, "p_solo_pubblico" boolean DEFAULT true) RETURNS TABLE("campo_id" integer, "struttura_id" integer, "campo_indice" integer, "nome_campo" "text", "nome_struttura" "text", "indirizzo" "text", "latitudine" double precision, "longitudine" double precision, "distanza_km" double precision, "sport_slug" "text", "nome_sport" "text", "tipo_superficie" "text", "coperto" boolean, "prezzo_orario" numeric, "sempre_aperto" boolean, "aperto_al_pubblico" boolean, "media_voti" double precision, "numero_recensioni" integer, "url_foto_copertina" "text", "total_count" integer, "sport_slugs" "text"[])
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public', 'extensions'
    AS $$
with user_pos as (
  select st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography as geog
),
rows as (
  select
    c.id as campo_id,
    s.id as struttura_id,
    row_number() over (partition by s.id order by c.id)::integer as campo_indice,
    c.nome_campo,
    s.nome as nome_struttura,
    s.indirizzo,
    s.latitudine::double precision,
    s.longitudine::double precision,
    (st_distance(s.posizione::geography, user_pos.geog) / 1000)::double precision as distanza_km,
    sports.slugs[1] as sport_slug,
    sports.nomi[1] as nome_sport,
    c.tipo_superficie,
    c.coperto,
    c.prezzo_orario,
    s.sempre_aperto,
    s.aperto_al_pubblico,
    coalesce(reviews.media_voti, 0)::double precision as media_voti,
    coalesce(reviews.numero_recensioni, 0)::integer as numero_recensioni,
    foto.url_foto as url_foto_copertina,
    count(*) over()::integer as total_count,
    sports.slugs as sport_slugs
  from public."Strutture" s
  join public."Campi" c on c.fk_struttura = s.id
  cross join user_pos
  left join lateral (
    select
      array_agg(sp.slug order by sp.id) as slugs,
      array_agg(sp.nome_sport order by sp.id) as nomi
    from public."Campi_Sport" cs
    join public."Sport" sp on sp.id = cs.fk_sport
    where cs.fk_campo = c.id
  ) sports on true
  left join lateral (
    select avg(r.stelle)::double precision as media_voti, count(*)::integer as numero_recensioni
    from public."RecensioniStrutture" r
    where r.fk_struttura = s.id
  ) reviews on true
  left join lateral (
    select fs.url_foto
    from public."Foto_Strutture" fs
    where fs.fk_struttura = s.id
      and fs.url_foto ~ '^https?://'
    order by fs.copertina desc, fs.ordine asc
    limit 1
  ) foto on true
  where s.attivo = true
    and s.verificata = true
    and (not p_solo_pubblico or s.aperto_al_pubblico = true)
    and c.attivo = true
    and (not p_solo_aperti or s.sempre_aperto = true)
    and (p_sport is null or p_sport = any(sports.slugs))
    and st_dwithin(
      s.posizione::geography,
      user_pos.geog,
      greatest(p_radius_km, 1) * 1000
    )
)
select *
from rows
order by distanza_km asc, struttura_id asc, campo_id asc
limit least(greatest(p_limit, 1), 250)
offset greatest(p_offset, 0);
$$;

ALTER FUNCTION "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text", "p_solo_aperti" boolean, "p_limit" integer, "p_offset" integer, "p_solo_pubblico" boolean) OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text", "p_solo_aperti" boolean, "p_limit" integer, "p_offset" integer, "p_solo_pubblico" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text", "p_solo_aperti" boolean, "p_limit" integer, "p_offset" integer, "p_solo_pubblico" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text", "p_solo_aperti" boolean, "p_limit" integer, "p_offset" integer, "p_solo_pubblico" boolean) TO "service_role";

-- 3. RLS — sostituire le policy permissive con lettura pubblica ristretta -------

-- Strutture
DROP POLICY IF EXISTS "admin full access" ON "public"."Strutture";
DROP POLICY IF EXISTS "Lettura pubblica strutture visibili" ON "public"."Strutture";
CREATE POLICY "Lettura pubblica strutture visibili" ON "public"."Strutture"
  FOR SELECT TO "authenticated", "anon"
  USING (("attivo" = true) AND ("verificata" = true));

-- Campi
DROP POLICY IF EXISTS "admin full access" ON "public"."Campi";
DROP POLICY IF EXISTS "Lettura pubblica campi visibili" ON "public"."Campi";
CREATE POLICY "Lettura pubblica campi visibili" ON "public"."Campi"
  FOR SELECT TO "authenticated", "anon"
  USING (
    ("attivo" = true)
    AND EXISTS (
      SELECT 1 FROM "public"."Strutture" s
      WHERE s.id = "Campi"."fk_struttura"
        AND s.attivo = true AND s.verificata = true
    )
  );

-- Campi_Sport (segue la visibilità del campo/struttura)
DROP POLICY IF EXISTS "admin full access" ON "public"."Campi_Sport";
DROP POLICY IF EXISTS "Lettura pubblica campi_sport visibili" ON "public"."Campi_Sport";
CREATE POLICY "Lettura pubblica campi_sport visibili" ON "public"."Campi_Sport"
  FOR SELECT TO "authenticated", "anon"
  USING (
    EXISTS (
      SELECT 1 FROM "public"."Campi" c
      JOIN "public"."Strutture" s ON s.id = c.fk_struttura
      WHERE c.id = "Campi_Sport"."fk_campo"
        AND c.attivo = true
        AND s.attivo = true AND s.verificata = true
    )
  );

-- Foto_Strutture (segue la visibilità della struttura)
DROP POLICY IF EXISTS "admin full access" ON "public"."Foto_Strutture";
DROP POLICY IF EXISTS "Lettura pubblica foto_strutture visibili" ON "public"."Foto_Strutture";
CREATE POLICY "Lettura pubblica foto_strutture visibili" ON "public"."Foto_Strutture"
  FOR SELECT TO "authenticated", "anon"
  USING (
    EXISTS (
      SELECT 1 FROM "public"."Strutture" s
      WHERE s.id = "Foto_Strutture"."fk_struttura"
        AND s.attivo = true AND s.verificata = true
    )
  );

-- Foto_Campi (segue la visibilità del campo/struttura; RLS era abilitata senza
-- alcuna policy, quindi finora negava tutto anche in lettura)
DROP POLICY IF EXISTS "Lettura pubblica foto_campi visibili" ON "public"."Foto_Campi";
CREATE POLICY "Lettura pubblica foto_campi visibili" ON "public"."Foto_Campi"
  FOR SELECT TO "authenticated", "anon"
  USING (
    EXISTS (
      SELECT 1 FROM "public"."Campi" c
      JOIN "public"."Strutture" s ON s.id = c.fk_struttura
      WHERE c.id = "Foto_Campi"."fk_campo"
        AND c.attivo = true
        AND s.attivo = true AND s.verificata = true
    )
  );

-- Strutture_Servizi (segue la visibilità della struttura)
DROP POLICY IF EXISTS "admin full access" ON "public"."Strutture_Servizi";
DROP POLICY IF EXISTS "Lettura pubblica strutture_servizi visibili" ON "public"."Strutture_Servizi";
CREATE POLICY "Lettura pubblica strutture_servizi visibili" ON "public"."Strutture_Servizi"
  FOR SELECT TO "authenticated", "anon"
  USING (
    EXISTS (
      SELECT 1 FROM "public"."Strutture" s
      WHERE s.id = "Strutture_Servizi"."fk_struttura"
        AND s.attivo = true AND s.verificata = true
    )
  );

-- Orari_Strutture (RLS era abilitata senza alcuna policy: negava tutto)
DROP POLICY IF EXISTS "Lettura pubblica orari_strutture visibili" ON "public"."Orari_Strutture";
CREATE POLICY "Lettura pubblica orari_strutture visibili" ON "public"."Orari_Strutture"
  FOR SELECT TO "authenticated", "anon"
  USING (
    EXISTS (
      SELECT 1 FROM "public"."Strutture" s
      WHERE s.id = "Orari_Strutture"."fk_struttura"
        AND s.attivo = true AND s.verificata = true
    )
  );

-- RecensioniStrutture: la lettura pubblica era USING(true), ora ristretta alla
-- struttura visibile. Le policy di insert/update/delete restano invariate.
DROP POLICY IF EXISTS "Lettura pubblica recensioni" ON "public"."RecensioniStrutture";
DROP POLICY IF EXISTS "Lettura pubblica recensioni strutture visibili" ON "public"."RecensioniStrutture";
CREATE POLICY "Lettura pubblica recensioni strutture visibili" ON "public"."RecensioniStrutture"
  FOR SELECT TO "authenticated", "anon"
  USING (
    EXISTS (
      SELECT 1 FROM "public"."Strutture" s
      WHERE s.id = "RecensioniStrutture"."fk_struttura"
        AND s.attivo = true AND s.verificata = true
    )
  );

-- Sport e Servizi restano cataloghi pubblici in lettura (non legati alla
-- visibilità di una singola struttura); si toglie solo la scrittura da anon.
DROP POLICY IF EXISTS "admin full access" ON "public"."Sport";
DROP POLICY IF EXISTS "Lettura pubblica sport" ON "public"."Sport";
CREATE POLICY "Lettura pubblica sport" ON "public"."Sport"
  FOR SELECT TO "authenticated", "anon"
  USING (true);

DROP POLICY IF EXISTS "admin full access" ON "public"."Servizi";
DROP POLICY IF EXISTS "Lettura pubblica servizi" ON "public"."Servizi";
CREATE POLICY "Lettura pubblica servizi" ON "public"."Servizi"
  FOR SELECT TO "authenticated", "anon"
  USING (true);
