import { describe, expect, it } from "vitest";

import {
  mapFotoStruttura,
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
};

describe("coordinate", () => {
  it("propaga la posizione della struttura nel CampoInLista", () => {
    const result = toCampoInLista(campo, struttura);

    expect(result.posizione).toEqual(struttura.posizione);
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
      tipo_superficie: "erba sintetica",
      coperto: true,
      prezzo_orario: 28,
      sempre_aperto: true,
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
});
