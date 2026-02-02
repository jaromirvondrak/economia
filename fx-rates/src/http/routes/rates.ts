import { Router } from "express";
import { RatesService } from "../../services/ratesService";

export const createRatesRouter = (ratesService: RatesService) => {
  const router = Router();

  // Vrátí všechny kurzy ve formátu požadovaném zadáním.
  // Pokud ještě nejsou data v cache, vrací 503.
  router.get("/rates", (_req, res) => {
    const all = ratesService.getAll();
    if (!all) {
      return res.status(503).json({ error: "Rates not available yet" });
    }

    return res.status(200).json(all);
  });

  // Vrátí kurz pro konkrétní měnu.
  // Kód měny je v URL parametru.
  router.get("/rates/:code", (req, res) => {
    const snapshot = ratesService.getSnapshot();
    if (!snapshot) {
      return res.status(503).json({ error: "Rates not available yet" });
    }

    const code = String(req.params.code || "").toUpperCase();
    // Validace kódu měny (3 písmena A‑Z).
    if (!/^[A-Z]{3}$/.test(code)) {
      return res.status(400).json({ error: "Invalid currency code" });
    }
    const value = snapshot.rates[code];

    if (typeof value !== "number") {
      return res
        .status(404)
        .json({ error: `Rate for ${code} not found` });
    }

    return res.status(200).json({ [code]: value });
  });

  // Jednoduchý admin endpoint pro zjištění posledního úspěšného fetchu.
  router.get("/admin/status", (_req, res) => {
    const snapshot = ratesService.getSnapshot();
    if (!snapshot) {
      return res.status(200).json({
        lastSuccessfulFetch: null,
        ratesCount: 0
      });
    }

    return res.status(200).json({
      lastSuccessfulFetch: snapshot.fetchedAt,
      ratesCount: Object.keys(snapshot.rates).length,
      base: snapshot.base
    });
  });

  return router;
};
