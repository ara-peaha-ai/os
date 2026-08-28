import { countries } from '../../app/data/countries.js'

const PRESET_AMOUNTS = [5000, 50000]

export const SETTLEMENT_COUNTRIES = {
  PY: pyConfig
}

const resolveSettlement = async (usd, settlementType, providers) => {
  const isNat = settlementType.endsWith('Local')
  const eligible = providers.filter(p => !p.maxUsd || usd <= p.maxUsd)
  if (!eligible.length) return null

  const results = await Promise.all(
    eligible.map(p => p.getQuote(usd).then(q => q ? { q } : null).catch((e) => { console.error(`[settlement] ${settlementType} provider failed for ${usd} USD:`, e?.message ?? e); return null }))
  )

  const valid = results.filter(r => {
    if (!r) return false
    const net = isNat ? r.q.netNational : r.q.netUsd
    return net != null && net > 0
  })

  if (!valid.length) return null

  return valid.reduce((best, curr) => {
    const netBest = isNat ? best.q.netNational : best.q.netUsd
    const netCurr = isNat ? curr.q.netNational : curr.q.netUsd
    return netCurr > netBest ? curr : best
  }).q
}

const buildSettlement = (quote, isNational, usd, peahaRate, banknote) => {
  if (!quote) return null
  const raw = isNational ? quote.netNational : quote.netUsd
  if (raw == null) return null
  // Peaha fee = usd * rate on the invoice; for local currency the exchange rate cancels out
  const net = isNational
    ? raw * (1 - peahaRate)
    : raw - usd * peahaRate
  const amount = isNational
    ? Math.floor(net / banknote) * banknote
    : Math.round(net * 100) / 100
  return { amount, verification: quote.verification }
}

export const buildSettlementQuote = async (usd, config) => {
  const countryData = countries.find(c => c.code === config.country)
  if (!countryData) throw createError({ statusCode: 500, message: `Country ${config.country} not found` })
  const { banknote } = countryData

  const peahaRate = getPeahaRate(usd)

  const byType = {}
  for (const p of config.providers) {
    if (!byType[p.settlementType]) byType[p.settlementType] = []
    byType[p.settlementType].push(p)
  }

  const SETTLEMENT_ORDER = ['bankUsd', 'cashUsd', 'bankLocal', 'cashLocal']
  const typeEntries = Object.entries(byType).sort(([a], [b]) => {
    const ai = SETTLEMENT_ORDER.indexOf(a)
    const bi = SETTLEMENT_ORDER.indexOf(b)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  const [btcRateData, comparison, ...settlementQuotes] = await Promise.all([
    getKrakenRate('BTC', 'USD'),
    config.getComparison(usd).catch(() => null),
    ...typeEntries.map(([type, providers]) =>
      resolveSettlement(usd, type, providers).catch(() => null)
    )
  ])

  const settlements = Object.fromEntries(
    typeEntries.map(([type], i) => [
      type,
      buildSettlement(settlementQuotes[i], type.endsWith('Local'), usd, peahaRate, banknote)
    ])
  )

  const localRate = comparison?.usd != null && comparison?.national != null
    ? comparison.national / comparison.usd
    : null

  const localCompare = comparison ? {
    usd: {
      amount: Math.round(comparison.usd * 100) / 100,
      verification: comparison.verification ?? 'enhanced'
    },
    national: comparison.national != null ? {
      amount: Math.floor(comparison.national / banknote) * banknote,
      verification: comparison.verification ?? 'enhanced'
    } : null
  } : null

  return {
    amount: usd,
    peahaFees: { rate: peahaRate },
    localCompare,
    localRate,
    btcRate: btcRateData.price,
    btcAmount: usd / btcRateData.price,
    settlements
  }
}

export const buildPresetQuotes = (config) =>
  Promise.all(PRESET_AMOUNTS.map(usd => buildSettlementQuote(usd, config)))
