import { Request, Response, NextFunction } from "express";
import { config } from "../../config";
import { logger } from "../../infra/logger";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  // Načtení API key z hlavičky requestu.
  const apiKey = req.header("x-api-key");

  // Pokud chybí nebo je špatný, požadavek se zamítne.
  if (!apiKey || apiKey !== config.apiKey) {
    // Zalogujeme neúspěšnou autentizaci (pro audit/debug).
    logger.warn("Unauthorized request", {
      ip: req.ip,
      path: req.path
    });
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Když je vše OK, pokračujeme na další handler.
  return next();
};
