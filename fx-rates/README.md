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

## HTTP API
### Healthcheck (public)
- `GET /healthcheck`
- Response: `200 text/plain` (např. `OK`)

### Zabezpečené endpointy (API key)
Header: `X-API-Key: <API_KEY>`

#### Všechny kurzy
- `GET /rates`
- Response (JSON):
```json
[
  { "USD": 23.45 },
  { "EUR": 24.12 }
]
```

#### Kurz konkrétní měny
- `GET /rates/:code`
- Response (JSON):
```json
{ "USD": 23.45 }
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

## Testy
```bash
npm test
```
