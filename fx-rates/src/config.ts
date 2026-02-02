// Typ popisuje, jaké položky konfigurace očekáváme.
export type AppConfig = {
  port: number;
  apiKey: string;
  sourceUrl: string;
  fetchIntervalMs: number;
  requestTimeoutMs: number;
};

// Pomocná funkce: převod textu na číslo.
// Pokud převod selže (NaN, nekonečno), použije se výchozí hodnota.
const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

// Centrální konfigurace načtená z proměnných prostředí.
export const config: AppConfig = {
  port: toNumber(process.env.PORT, 3000),
  apiKey: process.env.API_KEY || "dev-key",
  sourceUrl:
    process.env.SOURCE_URL || "https://open.er-api.com/v6/latest/CZK",
  fetchIntervalMs: toNumber(process.env.FETCH_INTERVAL_MS, 5 * 60 * 1000),
  requestTimeoutMs: toNumber(process.env.REQUEST_TIMEOUT_MS, 5000)
};
