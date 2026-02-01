import express from "express";
import { apiKeyAuth } from "./middleware/apiKeyAuth";
import { healthcheckRouter } from "./routes/healthcheck";
import { createRatesRouter } from "./routes/rates";
import { RatesService } from "../services/ratesService";

export const createApp = (ratesService: RatesService) => {
  const app = express();

  // Veřejné routy bez autentizace.
  app.use(healthcheckRouter);
  // Zabezpečené routy – vyžadují API key.
  app.use(apiKeyAuth, createRatesRouter(ratesService));

  return app;
};
