import { describe, expect, it } from "vitest";

import { mapFotoStruttura } from "@atimar/api";

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
