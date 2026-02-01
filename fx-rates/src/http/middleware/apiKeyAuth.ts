import { Request, Response, NextFunction } from "express";
import { config } from "../../config";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  // Načtení API key z hlavičky requestu.
  const apiKey = req.header("x-api-key");

  // Pokud chybí nebo je špatný, požadavek se zamítne.
  if (!apiKey || apiKey !== config.apiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Když je vše OK, pokračujeme na další handler.
  return next();
};
