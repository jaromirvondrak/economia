import { Router } from "express";

export const healthcheckRouter = Router();

// Veřejný healthcheck endpoint pro monitoring.
// Záměrně bez autentizace.
healthcheckRouter.get("/healthcheck", (_req, res) => {
  res.status(200).type("text/plain").send("OK");
});
