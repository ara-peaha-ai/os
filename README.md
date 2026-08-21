# Adding a new country

## Overview

Each country needs: a country data entry, at least one provider, and a country config file. The settlement engine handles routing automatically.

---

## Step 1 — Add the country to `app/data/countries.js`

Add an entry with `code`, `currency`, `symbol`, `banknote`, and `flag`:

```js
{ name: 'argentina', code: 'AR', flag: '🇦🇷', currency: 'ARS', symbol: 'AR$', banknote: 10000, phoneCode: '+54' }
```

- `banknote` — smallest denomination to floor local cash amounts to (e.g. 10000 ARS)
- `symbol` — used in the simulator for formatted local amounts

---

## Step 2 — Create provider files (or reuse existing ones)

Each provider is a file in `server/utils/providers/` that exports a quote function and a config object.

```js
// server/utils/providers/myProviderAR.js

const MAX_USD = 50_000

export const getMyProviderArQuote = async (usd) => {
  if (usd > MAX_USD) return null
  // fetch rate, compute net amount...
  return { netUsd: ..., verification: 'minimal' }  // or 'standard' / 'enhanced'
}

export const myProviderArConfig = {
  settlementType: 'cashUsd',   // one of: cashUsd | cashLocal | bankUsd | bankLocal
  maxUsd: MAX_USD,
  getQuote: getMyProviderArQuote
}
```

### Settlement types
| Key | Currency | Delivery |
|-----|----------|----------|
| `cashUsd` | USD | Cash |
| `cashLocal` | Local (ARS, PYG…) | Cash |
| `bankUsd` | USD | Bank wire |
| `bankLocal` | Local | Bank wire |

### Quote return shape
- `netUsd` — net amount in USD (for cashUsd / bankUsd)
- `netNational` — net amount in local currency (for cashLocal / bankLocal)
- `verification` — `'minimal'` / `'standard'` / `'enhanced'`
- Return `null` if amount is out of range or provider is unavailable

---

## Step 3 — Create a comparator (optional but recommended)

A comparator gives visitors a reference point ("what would they get via a competitor"). Lives in `server/utils/comparators/`.

```js
// server/utils/comparators/arSomeBank.js

const COMPETITOR_FEE = 0.03

export const getArSomeBankComparison = async (usd) => {
  const arsRate = await getSomeArRate()   // fetch official or market rate
  const netUsd = usd * (1 - COMPETITOR_FEE)
  return {
    usd: netUsd,
    national: arsRate ? netUsd * arsRate : null,
    verification: 'enhanced'
  }
}
```

The comparator also drives `localRate` (used to compute effective fee % for local currency settlements). If omitted, local fee % shows as `—` in the simulator.

---

## Step 4 — Create the country config in `server/utils/rails/`

```js
// server/utils/rails/AR.js

export const arConfig = {
  country: 'AR',
  getComparison: getArSomeBankComparison,   // omit if no comparator
  providers: [
    myProviderArConfig,
    krakenWiseArUsdConfig,   // if bank USD rail exists
    // add more providers here
  ]
}
```

That's it. No hardcoded fees, banknotes, or currency codes — all come from `countries.js` and the providers.

---

## Step 5 — Register the country in `server/utils/settlement.js`

```js
export const SETTLEMENT_COUNTRIES = {
  PY: pyConfig,
  AR: arConfig,   // ← add here
}
```

---

## How the engine works

1. Groups providers by `settlementType`
2. Filters by `maxUsd` limit per provider
3. Runs all eligible providers in parallel
4. Picks the one with the highest net for each settlement type
5. Applies Paguaitu fee on invoice USD value
6. Returns ordered results: `bankUsd → cashUsd → bankLocal → cashLocal`

Providers that throw or return `null` are silently skipped — the channel simply doesn't appear in the simulator.
