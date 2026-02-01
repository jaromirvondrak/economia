import { RatesCache, RatesSnapshot } from "../cache/ratesCache";
import { fetchRates } from "../infra/fetcher";
import { logger } from "../infra/logger";
import { parseRates } from "./ratesParser";

export class RatesService {
  constructor(private cache: RatesCache) {}

  // Stáhne nové kurzy, zvaliduje je a uloží do cache.
  // Pokud vše proběhne, vrací nový snapshot.
  /**
   * Provede jeden refresh kurzů (fetch + parse + uložení do cache).
   * Vyhazuje chybu, pokud se data nepodaří stáhnout nebo zvalidovat.
   */
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
  /**
   * Vrací kurzy jako pole objektů { "USD": 23.45 }.
   * Když cache ještě není naplněná, vrací null.
   */
  getAll(): Array<Record<string, number>> | null {
    const latest = this.cache.getLatest();
    if (!latest) return null;

    return Object.entries(latest.rates).map(([code, value]) => ({
      [code]: value
    }));
  }

  // Vrátí poslední snapshot pro interní použití.
  /**
   * Vrací poslední uložený snapshot nebo null, pokud nic není v cache.
   */
  getSnapshot(): RatesSnapshot | null {
    return this.cache.getLatest();
  }
}
