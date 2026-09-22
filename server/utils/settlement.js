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

const buildSettlement = (quote, isNational, usd, peahaRate, banknote, localRate) => {
  if (!quote) return null
  // Only the Peaha fee is applied; providers just decide which settlements are available
  const netUsd = usd * (1 - peahaRate)
  if (!isNational) return { amount: Math.round(netUsd * 100) / 100, verification: quote.verification }
  // If the comparator is down, fall back to this provider's own rate — safe since
  // netNational no longer bakes in a provider fee (see sokin.js), it's rate only.
  const rate = localRate ?? (usd > 0 ? quote.netNational / usd : null)
  if (!rate) return null
  const amount = Math.floor(netUsd * rate / banknote) * banknote
  return { amount, verification: quote.verification }
}

export const buildSettlementQuote = async (usd, config, { logProfit = false } = {}) => {
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

  const localRate = comparison?.usd != null && comparison?.national != null
    ? comparison.national / comparison.usd
    : null

  const settlements = Object.fromEntries(
    typeEntries.map(([type], i) => [
      type,
      buildSettlement(settlementQuotes[i], type.endsWith('Local'), usd, peahaRate, banknote, localRate)
    ])
  )

  if (logProfit) {
    const fee = usd * peahaRate
    const rows = typeEntries.flatMap(([type], i) => {
      const q = settlementQuotes[i]
      const isNational = type.endsWith('Local')
      if (!q || (isNational && !localRate)) return []
      const cost = isNational ? usd - q.netNational / localRate : usd - q.netUsd
      const profit = fee - cost
      return [{ settlement: type, fee: +fee.toFixed(2), providerCost: +cost.toFixed(2), profit: +profit.toFixed(2), profitPct: +(profit / usd * 100).toFixed(2) }]
    })
    console.log(`[profit] ${usd} USD — fee collected minus provider costs, before tax`)
    console.table(rows)
  }

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
