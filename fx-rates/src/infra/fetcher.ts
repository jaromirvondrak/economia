import { config } from "../config";

export type ExternalRatesResponse = {
  base: string;
  rates: Record<string, number>;
  date?: string;
  timestamp?: number;
};

// Stažení kurzů z externího API.
// Funkce vrací data v jednoduché struktuře, se kterou umí pracovat parser.
export const fetchRates = async (): Promise<ExternalRatesResponse> => {
  // AbortController umožní request ukončit, když trvá moc dlouho.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);

  try {
    const response = await fetch(config.sourceUrl, {
      method: "GET",
      signal: controller.signal
    });

    // Všechny odpovědi mimo 2xx považujeme za chybu.
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Načtení JSON do objektu.
    const data = (await response.json()) as Record<string, unknown>;

    // Podpora více tvarů odpovědí (různé veřejné API).
    const base =
      (typeof data.base === "string" && data.base) ||
      (typeof data.base_code === "string" && data.base_code) ||
      "";
    const rates = (data.rates as Record<string, number> | undefined) || undefined;

    // Základní validace povinných polí.
    if (!base || !rates) {
      const keys = Object.keys(data || {});
      throw new Error(`Invalid response shape. Keys: ${keys.join(", ")}`);
    }

    return {
      base,
      rates,
      date: typeof data.date === "string" ? data.date : undefined,
      timestamp: typeof data.timestamp === "number" ? data.timestamp : undefined
    };
  } finally {
    // Timeout vždy zrušíme, aby nezůstal viset v paměti.
    clearTimeout(timeout);
  }
};
