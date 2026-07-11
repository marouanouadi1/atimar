-- Un campo puo' essere associato a piu' sport (campi polivalenti, es. "Campo
-- polivalente coperto" -> Calcio a 5 + Tennis). La versione precedente della
-- funzione considerava un solo sport per campo (join lateral con limit 1
-- filtrato su p_sport), quindi:
--  - un campo polivalente veniva escluso dalla ricerca quando il suo sport
--    "primario" non coincideva con p_sport, anche se lo sport cercato era
--    comunque tra quelli associati al campo;
--  - un campo senza alcuna riga in Campi_Sport spariva del tutto dai
--    risultati (inner join), anche filtrando su "tutti gli sport".
-- Questa versione aggrega tutti gli sport del campo, filtra per appartenenza
-- all'array e restituisce anche l'elenco completo (sport_slugs) cosi' il
-- client puo' replicare la stessa logica di filtro lato catalogo.
-- CREATE OR REPLACE non ammette di cambiare l'elenco colonne di un RETURNS
-- TABLE (SQLSTATE 42P13: "cannot change return type of existing function"),
-- quindi va ricreata da zero.
DROP FUNCTION IF EXISTS "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text", "p_solo_aperti" boolean, "p_limit" integer, "p_offset" integer);

CREATE FUNCTION "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text" DEFAULT NULL::"text", "p_solo_aperti" boolean DEFAULT false, "p_limit" integer DEFAULT 100, "p_offset" integer DEFAULT 0) RETURNS TABLE("campo_id" integer, "struttura_id" integer, "campo_indice" integer, "nome_campo" "text", "nome_struttura" "text", "indirizzo" "text", "latitudine" double precision, "longitudine" double precision, "distanza_km" double precision, "sport_slug" "text", "nome_sport" "text", "tipo_superficie" "text", "coperto" boolean, "prezzo_orario" numeric, "sempre_aperto" boolean, "media_voti" double precision, "numero_recensioni" integer, "url_foto_copertina" "text", "total_count" integer, "sport_slugs" "text"[])
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

ALTER FUNCTION "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text", "p_solo_aperti" boolean, "p_limit" integer, "p_offset" integer) OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text", "p_solo_aperti" boolean, "p_limit" integer, "p_offset" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text", "p_solo_aperti" boolean, "p_limit" integer, "p_offset" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_campi_nearby"("p_lat" double precision, "p_lng" double precision, "p_radius_km" double precision, "p_sport" "text", "p_solo_aperti" boolean, "p_limit" integer, "p_offset" integer) TO "service_role";
