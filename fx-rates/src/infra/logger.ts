// Podporované úrovně logu.
// Podle úrovně voláme odpovídající metodu console.*
type LogLevel = "info" | "warn" | "error";

// Obecná funkce pro logování.
// Přidává timestamp a jednotný formát zprávy.
const log = (level: LogLevel, message: string, meta?: Record<string, unknown>) => {
  const ts = new Date().toISOString();
  if (meta) {
    console[level](`[${ts}] ${level.toUpperCase()} ${message}`, meta);
  } else {
    console[level](`[${ts}] ${level.toUpperCase()} ${message}`);
  }
};

// Jednoduché rozhraní loggeru používané v celé aplikaci.
// Díky tomu lze později snadno nahradit implementaci (např. logovací knihovnou).
export const logger = {
  info: (message: string, meta?: Record<string, unknown>) =>
    log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) =>
    log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) =>
    log("error", message, meta)
};
