import { describe, expect, it } from "vitest";
import { RatesCache } from "../src/cache/ratesCache";

describe("RatesCache", () => {
  it("stores and returns latest snapshot", () => {
    const cache = new RatesCache();
    expect(cache.getLatest()).toBeNull();

    cache.setLatest({
      base: "EUR",
      fetchedAt: "2026-01-01T00:00:00.000Z",
      rates: { USD: 1.1 }
    });

    const latest = cache.getLatest();
    expect(latest?.base).toBe("EUR");
    expect(latest?.rates.USD).toBe(1.1);
  });
});
