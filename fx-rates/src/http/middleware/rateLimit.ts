import { Request, Response, NextFunction } from "express";

// Jednoduchý in-memory rate limit pro zabezpečené routy.
// Omezí počet requestů z jedné IP za časové okno.
// Poznámka: Pro produkci ve více instancích by bylo lepší centrální úložiště (např. Redis).

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

// Nastavení limiteru (lze upravit podle potřeby).
const WINDOW_MS = 60_000; // 1 minuta
const MAX_REQUESTS = 60; // max 60 requestů za minutu z jedné IP

const buckets = new Map<string, RateLimitEntry>();

export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  // IP adresa klienta (Express ji umí získat z req.ip).
  const key = req.ip || "unknown";
  const now = Date.now();

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    // Nové okno – resetujeme počítadlo.
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  // Už máme aktivní okno – zvýšíme počítadlo.
  current.count += 1;

  if (current.count > MAX_REQUESTS) {
    // Překročen limit – vrátíme 429 Too Many Requests.
    return res.status(429).json({
      error: "Rate limit exceeded",
      retryAfterMs: current.resetAt - now
    });
  }

  return next();
};
