const getIvanFee = (usd) => {
  if (usd <= 5_000) return 0.025
  if (usd <= 25_000) return 0.02
  return 0.015
}

export const getIvanQuote = async (usd) => {
  const rates = await getCambiosChacoRates()
  const usdRate = rates.find(r => r.currency === 'USD')
  if (!usdRate) throw createError({ statusCode: 502, message: 'USD rate unavailable' })
  const fee = getIvanFee(usd)
  const netUsd = usd * (1 - fee)
  return { netUsd, netPyg: netUsd * usdRate.purchase, fee, usdPygRate: usdRate.purchase }
}
