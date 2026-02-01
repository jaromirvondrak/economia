# FX Rates API

Periodicky stahuje kurzovní lístek, ukládá poslední úspěšná data do in-memory cache a poskytuje HTTP API.

## Požadavky
- Node.js >= 18

## Rychlý start
```bash
npm install
cp .env.example .env
npm run dev
```

## Konfigurace (.env)
- `API_KEY` – API key pro zabezpečené endpointy (header `X-API-Key`)
- `PORT` – port serveru
- `FETCH_INTERVAL_MS` – interval stahování kurzů
- `SOURCE_URL` – URL zdroje kurzů (základní měna je CZK)
- `REQUEST_TIMEOUT_MS` – timeout requestu

## Zdroj kurzů a perioda stahování
- Zdroj kurzů nastavíte v `SOURCE_URL`.
- Periodu stahování nastavíte v `FETCH_INTERVAL_MS` (v milisekundách).

## HTTP API
### Healthcheck (public)
- `GET /healthcheck`
- Response: `200 text/plain` (např. `OK`)

### Zabezpečené endpointy (API key)
Header: `X-API-Key: <API_KEY>`

Poznámka: Pro jednoduché B2B/interní použití stačí API key. Healthcheck je veřejný.
Rate limit pro zabezpečené routy je nastaven na 60 requestů/min/IP (konfigurace v `src/http/middleware/rateLimit.ts`).

#### Všechny kurzy
- `GET /rates`
- Response (JSON):
```json
[
  { "GBP": 29.87 },
  { "JPY": 0.15 }
]
```

#### Kurz konkrétní měny
- `GET /rates/:code`
- Response (JSON):
```json
{ "GBP": 29.87 }
```
- Pokud měna neexistuje: `404` + JSON `{ "error": "..." }`

#### Admin status
- `GET /admin/status`
- Response (JSON):
```json
{
  "lastSuccessfulFetch": "2026-02-01T10:00:00.000Z",
  "ratesCount": 32,
  "base": "EUR"
}
```

## Poznámky
- Cache vždy drží poslední úspěšně stažená data.
- Při chybě stahování aplikace běží dál a loguje chybu.

## Stručná architektura
- `src/index.ts` spouští scheduler a HTTP server.
- `RatesService.refresh()` → fetch → parse → cache.
- In‑memory cache drží **poslední úspěšná** data.
- HTTP vrstva je oddělená v `src/http` a používá API key middleware.

## Testy
```bash
npm test
```

## Příklady curl
Healthcheck (public):
```bash
curl http://localhost:3000/healthcheck
```

Všechny kurzy (API key):
```bash
curl -H "X-API-Key: zkusebni_api_klic" http://localhost:3000/rates
```

Konkrétní měna:
```bash
curl -H "X-API-Key: zkusebni_api_klic" http://localhost:3000/rates/GBP
```

Admin status:
```bash
curl -H "X-API-Key: zkusebni_api_klic" http://localhost:3000/admin/status
```
