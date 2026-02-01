export type RatesSnapshot = {
  base: string;
  fetchedAt: string;
  rates: Record<string, number>;
};

// Jednoduchá in-memory cache s posledním úspěšným snapshotem.
// Ukládá se pouze jedna verze – vždy ta poslední úspěšná.
export class RatesCache {
  // V paměti držíme poslední úspěšně stažená data.
  // Pokud ještě nic neproběhlo, je hodnota null.
  private latest: RatesSnapshot | null = null;

  // Vrátí poslední snapshot (nebo null, pokud ještě žádný není).
  getLatest(): RatesSnapshot | null {
    return this.latest;
  }

  // Uloží nový snapshot.
  // Starý snapshot se tím přepíše.
  setLatest(snapshot: RatesSnapshot): void {
    this.latest = snapshot;
  }
}
