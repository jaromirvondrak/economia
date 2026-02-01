import { describe, expect, it } from "vitest";
import { parseRates } from "../src/services/ratesParser";

describe("parseRates", () => {
  it("parses valid rates", () => {
    // Vstup s validními i nevalidními položkami.
    const result = parseRates({
      base: "eur",
      rates: { USD: 23.45, Eur: 1, BAD: "nope" }
    });

    // Očekáváme normalizovanou base měnu a jen validní kurzy.
    expect(result.base).toBe("EUR");
    expect(result.rates.USD).toBe(23.45);
    expect(result.rates.EUR).toBe(1);
    expect(result.rates.BAD).toBeUndefined();
    expect(result.fetchedAt).toBeTypeOf("string");
  });

  it("throws on invalid base", () => {
    // Neplatná base měna musí vyhodit chybu.
    expect(() => parseRates({ base: 123, rates: {} })).toThrow();
    expect(() => parseRates({ base: "EURO", rates: {} })).toThrow();
  });

  it("throws when no valid rates", () => {
    // Pokud po filtrování nezůstane žádná validní měna, je to chyba.
    expect(() => parseRates({ base: "EUR", rates: { AAA: "x" } })).toThrow();
  });
});
