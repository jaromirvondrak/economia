import { RatesCache, RatesSnapshot } from "../cache/ratesCache";
import { fetchRates } from "../infra/fetcher";
import { logger } from "../infra/logger";
import { parseRates } from "./ratesParser";

export class RatesService {
  constructor(private cache: RatesCache) {}

  // Stáhne nové kurzy, zvaliduje je a uloží do cache.
  // Pokud vše proběhne, vrací nový snapshot.
  async refresh(): Promise<RatesSnapshot> {
    const external = await fetchRates();
    const parsed = parseRates(external);
    const snapshot: RatesSnapshot = {
      base: parsed.base,
      fetchedAt: parsed.fetchedAt,
      rates: parsed.rates
    };

    this.cache.setLatest(snapshot);
    logger.info("Rates refreshed", {
      base: snapshot.base,
      size: Object.keys(snapshot.rates).length,
      fetchedAt: snapshot.fetchedAt
    });

    return snapshot;
  }

  // Vrátí všechny kurzy ve formátu požadovaném API.
  // Pokud ještě nejsou data, vrací null.
  getAll(): Array<Record<string, number>> | null {
    const latest = this.cache.getLatest();
    if (!latest) return null;

    return Object.entries(latest.rates).map(([code, value]) => ({
      [code]: value
    }));
  }

  // Vrátí poslední snapshot pro interní použití.
  getSnapshot(): RatesSnapshot | null {
    return this.cache.getLatest();
  }
}
