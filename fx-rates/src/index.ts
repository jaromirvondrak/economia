import "dotenv/config";
import { config } from "./config";
import { createApp } from "./http/app";
import { RatesCache } from "./cache/ratesCache";
import { RatesService } from "./services/ratesService";
import { logger } from "./infra/logger";

// Inicializace hlavních služeb aplikace.
const cache = new RatesCache();
const ratesService = new RatesService(cache);

const startScheduler = () => {
  // Funkce, která jednou zkusí stáhnout nové kurzy.
  const run = async () => {
    try {
      await ratesService.refresh();
    } catch (error) {
      logger.warn("Rates refresh failed", {
        error: error instanceof Error ? error.message : String(error),
        sourceUrl: config.sourceUrl
      });
    }
  };

  // Spustíme hned a pak opakujeme v nastaveném intervalu.
  void run();
  const interval = setInterval(run, config.fetchIntervalMs);
  return () => clearInterval(interval);
};

const startServer = () => {
  // Vytvoří HTTP aplikaci a spustí server.
  const app = createApp(ratesService);
  const server = app.listen(config.port, () => {
    logger.info(`HTTP server listening on port ${config.port}`);
  });
  return server;
};

if (!config.apiKey || config.apiKey === "dev-key") {
  logger.warn("Using default API key. Set API_KEY in .env for production.");
}

const stopScheduler = startScheduler();
const server = startServer();

const shutdown = (signal: string) => {
  // Graceful shutdown: zastavíme interval a ukončíme HTTP server.
  logger.info(`Received ${signal}, shutting down...`);
  stopScheduler();
  server.close((err) => {
    if (err) {
      logger.error("Error during server shutdown", {
        error: err instanceof Error ? err.message : String(err)
      });
      process.exit(1);
    }
    logger.info("Shutdown complete");
    process.exit(0);
  });
};

// Zpracování signálů z OS (např. Ctrl+C nebo ukončení procesu).
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
