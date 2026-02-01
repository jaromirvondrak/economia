export type ParsedRates = {
  base: string;
  rates: Record<string, number>;
  fetchedAt: string;
};

// Ověření 3‑písmenného kódu měny (ISO 4217).
const isIsoCode = (code: string): boolean => /^[A-Z]{3}$/.test(code);

// Parsování a validace externích dat do interního formátu.
// Tady řešíme „očistu“ dat z API (filtrování neplatných položek).
export const parseRates = (input: {
  base?: unknown;
  rates?: unknown;
}): ParsedRates => {
  // Validace základní měny.
  if (typeof input.base !== "string" || !isIsoCode(input.base.toUpperCase())) {
    throw new Error("Invalid base currency");
  }

  // Validace objektu s kurzy.
  if (!input.rates || typeof input.rates !== "object") {
    throw new Error("Invalid rates payload");
  }

  const rates: Record<string, number> = {};
  for (const [key, value] of Object.entries(input.rates as Record<string, unknown>)) {
    const code = key.toUpperCase();
    // Přeskočit neplatné kódy.
    if (!isIsoCode(code)) continue;
    // Přeskočit nečíselné hodnoty.
    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    rates[code] = value;
  }

  // Musíme mít aspoň jednu platnou měnu.
  if (Object.keys(rates).length === 0) {
    throw new Error("No valid rates found");
  }

  return {
    base: input.base.toUpperCase(),
    rates,
    fetchedAt: new Date().toISOString()
  };
};
