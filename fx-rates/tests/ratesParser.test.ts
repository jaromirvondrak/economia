import { describe, expect, it } from "vitest";
import { parseRates } from "../src/services/ratesParser";

describe("parseRates", () => {
  it("parses valid rates", () => {
    const result = parseRates({
      base: "eur",
      rates: { USD: 23.45, Eur: 1, BAD: "nope" }
    });

    expect(result.base).toBe("EUR");
    expect(result.rates.USD).toBe(23.45);
    expect(result.rates.EUR).toBe(1);
    expect(result.rates.BAD).toBeUndefined();
    expect(result.fetchedAt).toBeTypeOf("string");
  });

  it("throws on invalid base", () => {
    expect(() => parseRates({ base: 123, rates: {} })).toThrow();
    expect(() => parseRates({ base: "EURO", rates: {} })).toThrow();
  });

  it("throws when no valid rates", () => {
    expect(() => parseRates({ base: "EUR", rates: { AAA: "x" } })).toThrow();
  });
});
