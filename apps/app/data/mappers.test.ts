import { describe, expect, it } from "vitest";

import {
  mapFotoStruttura,
  mapRowToCampo,
  mapRowToStruttura,
  mapNearbyCampoRowToCampoInLista,
  toCampoInLista,
} from "@atimar/api";
import type { Campo, Struttura } from "@atimar/types";

describe("mapFotoStruttura", () => {
  it("antepone la foto copertina all'ordinamento numerico", () => {
    const result = mapFotoStruttura([
      { url_foto: "https://cdn.test/first.jpg", copertina: false, ordine: 1 },
      { url_foto: "https://cdn.test/cover.jpg", copertina: true, ordine: 9 },
    ]);

    expect(result.urlFotoCopertina).toBe("https://cdn.test/cover.jpg");
    expect(result.foto.map((f) => f.urlFoto)).toEqual([
      "https://cdn.test/cover.jpg",
      "https://cdn.test/first.jpg",
    ]);
  });

  it("usa ordine ascendente quando non c'è una copertina", () => {
    const result = mapFotoStruttura([
      { url_foto: "https://cdn.test/third.jpg", copertina: false, ordine: 3 },
      { url_foto: "https://cdn.test/first.jpg", copertina: false, ordine: 1 },
    ]);

    expect(result.urlFotoCopertina).toBe("https://cdn.test/first.jpg");
  });

  it("ignora URL non validi e non supportati", () => {
    const result = mapFotoStruttura([
      { url_foto: "not-a-url", copertina: true, ordine: 0 },
      { url_foto: "file:///private/photo.jpg", copertina: false, ordine: 1 },
    ]);

    expect(result).toEqual({ foto: [], urlFotoCopertina: null });
  });
});

const campo: Campo = {
  id: "10",
  strutturaId: "1",
  indice: 1,
  nome: "Campo 1",
  idSport: "padel",
  sportIds: ["padel"],
  nomeSport: "Padel",
  superficie: "erba sintetica",
  coperto: false,
  prezzoOrario: 24,
  prezzoLabel: "€24",
  aperto: true,
};

const struttura: Struttura = {
  id: "1",
  nome: "Centro Test",
  idSport: ["padel"],
  indirizzo: "Via Test 1",
  posizione: { lat: 45.4642, lng: 9.19 },
  mappa: { x: 0.2, y: 0.3 },
  distanzaKm: 0,
  distanza: "",
  mediaVoti: 4.6,
  numeroRecensioni: 12,
  sempreAperto: true,
  coperto: false,
  servizi: ["Spogliatoi"],
  descrizione: "Centro sportivo di test",
  tipoHero: "padel-green",
  foto: [],
  urlFotoCopertina: null,
  prezzoDa: 24,
  prezzoDaLabel: "da €24",
  linkPrenotazione: null,
  telefono: null,
  linkSitoWeb: null,
  apertoAlPubblico: true,
};

describe("coordinate", () => {
  it("propaga la posizione della struttura nel CampoInLista", () => {
    const result = toCampoInLista(campo, struttura);

    expect(result.posizione).toEqual(struttura.posizione);
  });
});

describe("coperto nullable", () => {
  it("mantiene null quando mappa un campo", () => {
    const result = mapRowToCampo({
      id: 10,
      fk_struttura: 1,
      nome_campo: "Campo da verificare",
      tipo_superficie: null,
      coperto: null,
      prezzo_orario: null,
      attivo: true,
      Campi_Sport: [],
    });

    expect(result.coperto).toBeNull();
  });

  it("aggrega la struttura come coperta se almeno un campo attivo è coperto", () => {
    const result = mapRowToStruttura({
      ...strutturaRowFixture(),
      Campi: [
        campoRowFixture({ id: 1, coperto: false }),
        campoRowFixture({ id: 2, coperto: true }),
        campoRowFixture({ id: 3, coperto: null }),
      ],
    });

    expect(result.coperto).toBe(true);
  });

  it("aggrega la struttura come scoperta solo se tutti i campi attivi sono scoperti", () => {
    const result = mapRowToStruttura({
      ...strutturaRowFixture(),
      Campi: [
        campoRowFixture({ id: 1, coperto: false }),
        campoRowFixture({ id: 2, coperto: false }),
      ],
    });

    expect(result.coperto).toBe(false);
  });

  it("aggrega la struttura come da verificare se nessun campo è coperto e almeno uno è ignoto", () => {
    const result = mapRowToStruttura({
      ...strutturaRowFixture(),
      Campi: [
        campoRowFixture({ id: 1, coperto: false }),
        campoRowFixture({ id: 2, coperto: null }),
      ],
    });

    expect(result.coperto).toBeNull();
  });
});

describe("mapRowToCampo sport", () => {
  it("espone tutti gli sport associati a un campo polivalente", () => {
    const result = mapRowToCampo({
      id: 20,
      fk_struttura: 1,
      nome_campo: "Campo polivalente coperto",
      tipo_superficie: null,
      coperto: true,
      prezzo_orario: 20,
      attivo: true,
      Campi_Sport: [
        { fk_campo: 20, fk_sport: 4, Sport: { id: 4, nome_sport: "Tennis", slug: "tennis" } },
        { fk_campo: 20, fk_sport: 2, Sport: { id: 2, nome_sport: "Calcio a 5", slug: "calcio5" } },
      ],
    });

    // Sport primario deterministico: id sport più basso, indipendentemente
    // dall'ordine restituito da Supabase per le relazioni annidate.
    expect(result.idSport).toBe("calcio5");
    expect(result.sportIds).toEqual(["calcio5", "tennis"]);
  });

  it("usa una etichetta di fallback per un campo senza sport associati", () => {
    const result = mapRowToCampo({
      id: 21,
      fk_struttura: 1,
      nome_campo: "Palestra generica",
      tipo_superficie: null,
      coperto: null,
      prezzo_orario: null,
      attivo: true,
      Campi_Sport: [],
    });

    expect(result.idSport).toBe("");
    expect(result.sportIds).toEqual([]);
    expect(result.nomeSport).toBe("Sport non specificato");
  });
});

describe("mapNearbyCampoRowToCampoInLista", () => {
  it("mappa una riga RPC geospaziale in CampoInLista", () => {
    const result = mapNearbyCampoRowToCampoInLista({
      campo_id: 42,
      struttura_id: 7,
      campo_indice: 2,
      nome_campo: "Campo Blu",
      nome_struttura: "Padel Milano",
      indirizzo: "Via Milano 7",
      latitudine: 45.4642,
      longitudine: 9.19,
      distanza_km: 3.24,
      sport_slug: "padel",
      nome_sport: "Padel",
      sport_slugs: ["padel"],
      tipo_superficie: "erba sintetica",
      coperto: true,
      prezzo_orario: 28,
      sempre_aperto: true,
      aperto_al_pubblico: true,
      media_voti: 4.7,
      numero_recensioni: 18,
      url_foto_copertina: "https://cdn.test/cover.jpg",
      total_count: 12,
    });

    expect(result).toMatchObject({
      id: "42",
      strutturaId: "7",
      indice: 2,
      nome: "Campo Blu",
      nomeStruttura: "Padel Milano",
      idSport: "padel",
      sportIds: ["padel"],
      nomeSport: "Padel",
      posizione: { lat: 45.4642, lng: 9.19 },
      distanzaKm: 3.24,
      distanza: "3,2 km",
      prezzoLabel: "€28",
      aperto: true,
      mediaVoti: 4.7,
      numeroRecensioni: 18,
      tipoHero: "padel-green",
      urlFotoCopertina: "https://cdn.test/cover.jpg",
    });
  });

  it("mantiene null per il coperto ignoto della RPC geospaziale", () => {
    const result = mapNearbyCampoRowToCampoInLista({
      campo_id: 43,
      struttura_id: 7,
      campo_indice: 1,
      nome_campo: "Campo ignoto",
      nome_struttura: "Centro Test",
      indirizzo: "Via Test 7",
      latitudine: 45.4642,
      longitudine: 9.19,
      distanza_km: 1.2,
      sport_slug: "padel",
      nome_sport: "Padel",
      sport_slugs: ["padel"],
      tipo_superficie: null,
      coperto: null,
      prezzo_orario: null,
      sempre_aperto: true,
      aperto_al_pubblico: true,
      media_voti: null,
      numero_recensioni: null,
      url_foto_copertina: null,
      total_count: 1,
    });

    expect(result.coperto).toBeNull();
  });

  it("espone tutti gli sport di un campo polivalente, non solo il primario", () => {
    const result = mapNearbyCampoRowToCampoInLista({
      campo_id: 44,
      struttura_id: 8,
      campo_indice: 1,
      nome_campo: "Campo polivalente coperto",
      nome_struttura: "Centro Polivalente",
      indirizzo: "Via Test 8",
      latitudine: 45.4642,
      longitudine: 9.19,
      distanza_km: 2.1,
      sport_slug: "calcio5",
      nome_sport: "Calcio a 5",
      sport_slugs: ["calcio5", "tennis"],
      tipo_superficie: null,
      coperto: true,
      prezzo_orario: 20,
      sempre_aperto: true,
      aperto_al_pubblico: true,
      media_voti: null,
      numero_recensioni: null,
      url_foto_copertina: null,
      total_count: 1,
    });

    expect(result.idSport).toBe("calcio5");
    expect(result.sportIds).toEqual(["calcio5", "tennis"]);
  });

  it("usa un'etichetta di fallback quando il campo non ha sport associati", () => {
    const result = mapNearbyCampoRowToCampoInLista({
      campo_id: 45,
      struttura_id: 9,
      campo_indice: 1,
      nome_campo: "Palestra generica",
      nome_struttura: "Centro Fitness",
      indirizzo: "Via Test 9",
      latitudine: 45.4642,
      longitudine: 9.19,
      distanza_km: 0.5,
      sport_slug: null,
      nome_sport: null,
      sport_slugs: null,
      tipo_superficie: null,
      coperto: null,
      prezzo_orario: null,
      sempre_aperto: true,
      aperto_al_pubblico: true,
      media_voti: null,
      numero_recensioni: null,
      url_foto_copertina: null,
      total_count: 1,
    });

    expect(result.idSport).toBe("");
    expect(result.sportIds).toEqual([]);
    expect(result.nomeSport).toBe("Sport non specificato");
  });
});

function strutturaRowFixture() {
  return {
    id: 1,
    nome: "Centro Test",
    descrizione: null,
    indirizzo: "Via Test 1",
    latitudine: 45.4642,
    longitudine: 9.19,
    prezzo_orario: null,
    sempre_aperto: true,
    attivo: true,
    aperto_al_pubblico: true,
    link_prenotazione_esterno: null,
    telefono: null,
    link_sito_web: null,
    Campi: [],
    Strutture_Servizi: [],
    RecensioniStrutture: [],
    Foto_Strutture: [],
  };
}

function campoRowFixture(overrides: { id: number; coperto: boolean | null }) {
  return {
    id: overrides.id,
    fk_struttura: 1,
    nome_campo: `Campo ${overrides.id}`,
    tipo_superficie: null,
    coperto: overrides.coperto,
    prezzo_orario: null,
    attivo: true,
    Campi_Sport: [],
  };
}
