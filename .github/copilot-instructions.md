# Copilot instructions for this workspace

## Current state of the repo
- The project lives in [fx-rates](../fx-rates) and is implemented in Node.js + TypeScript.
- Main entrypoint: [fx-rates/src/index.ts](../fx-rates/src/index.ts) (scheduler + HTTP server + graceful shutdown).
- README with API and usage: [fx-rates/README.md](../fx-rates/README.md).

## How to navigate the spec
- Treat the PDF in [fx-rates/zadani_2_kolo_node_ts_fx_rates.pdf](../fx-rates/zadani_2_kolo_node_ts_fx_rates.pdf) as the authoritative specification for requirements, APIs, and expected outputs.
- If you implement code, keep a direct mapping between any features you add and the corresponding sections in the PDF.

## Project conventions (discovered)
- Keep **Czech, beginner-friendly comments** in source files (see [fx-rates/src](../fx-rates/src)).
- Clean separation of layers: HTTP in [fx-rates/src/http](../fx-rates/src/http), services in [fx-rates/src/services](../fx-rates/src/services), infra in [fx-rates/src/infra](../fx-rates/src/infra), cache in [fx-rates/src/cache](../fx-rates/src/cache).
- API responses follow strict shapes from the spec (array of single-key objects for `/rates`).
- Validation is done in parser and in routes (e.g. currency code format in [fx-rates/src/http/routes/rates.ts](../fx-rates/src/http/routes/rates.ts)).

## Tooling and workflows (discovered)
- Dev server: `npm run dev` (tsx watch).
- Build: `npm run build`.
- Run prod build: `npm run start`.
- Tests: `npm test` / `npm run test:watch` (Vitest).
- Env config in [fx-rates/.env.example](../fx-rates/.env.example) (Czech comments).

## Integration points (discovered)
- External FX API defined by `SOURCE_URL` (default CZK base) in [fx-rates/src/config.ts](../fx-rates/src/config.ts).
- API key auth via `X-API-Key` header (see [fx-rates/src/http/middleware/apiKeyAuth.ts](../fx-rates/src/http/middleware/apiKeyAuth.ts)).

## Architecture & data flow (essential)
- Scheduler periodically calls `RatesService.refresh()` → fetch → parse → cache.
- Cache stores only the **last successful** snapshot; failed fetches keep old data.
- Admin status exposes last successful fetch time: `GET /admin/status`.

## Tests (required coverage)
- Unit tests exist for parser, service, and cache under [fx-rates/tests](../fx-rates/tests).
- When changing parser/service/cache behavior, update corresponding tests.
