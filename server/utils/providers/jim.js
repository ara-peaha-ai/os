const DELIVERY_FEE_PYG = 100_000

const getJimFee = (usd) => {
  if (usd >= 50_000) return 0.01
  if (usd >= 25_000) return 0.0125
  if (usd >= 2_000) return 0.015
  return 0.02
}

export const getJimQuote = async (usd) => {
  const rates = await getCambiosChacoRates()
  const usdRate = rates.find(r => r.currency === 'USD')
  if (!usdRate) throw createError({ statusCode: 502, message: 'USD rate unavailable' })
  const fee = getJimFee(usd)
  const netPyg = usd * usdRate.purchase * (1 - fee) - DELIVERY_FEE_PYG
  const netUsd = netPyg > 0 ? netPyg / usdRate.purchase : null
  return { netPyg, netUsd, fee, usdPygRate: usdRate.purchase }
}
