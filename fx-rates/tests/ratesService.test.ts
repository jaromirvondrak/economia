import { describe, expect, it, vi } from "vitest";
import { RatesCache } from "../src/cache/ratesCache";
import { RatesService } from "../src/services/ratesService";
import * as fetcher from "../src/infra/fetcher";

describe("RatesService", () => {
  it("refresh updates cache", async () => {
    const cache = new RatesCache();
    const service = new RatesService(cache);

    vi.spyOn(fetcher, "fetchRates").mockResolvedValue({
      base: "EUR",
      rates: { USD: 1.2, EUR: 1 }
    });

    await service.refresh();
    const snapshot = service.getSnapshot();
    expect(snapshot?.base).toBe("EUR");
    expect(snapshot?.rates.USD).toBe(1.2);
  });

  it("getAll returns array format", async () => {
    const cache = new RatesCache();
    const service = new RatesService(cache);

    vi.spyOn(fetcher, "fetchRates").mockResolvedValue({
      base: "EUR",
      rates: { USD: 1.2, EUR: 1 }
    });

    await service.refresh();
    const all = service.getAll();
    expect(all).toEqual([{ USD: 1.2 }, { EUR: 1 }]);
  });
});
