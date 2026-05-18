const MAX_USD = 50_000

const getIvanFee = (usd) => {
  if (usd <= 5_000) return 0.025
  if (usd <= 25_000) return 0.02
  return 0.015
}

export const getIvanQuote = async (usd) => {
  if (usd > MAX_USD) return null
  const rates = await getCambiosChacoRates()
  const usdRate = rates.find(r => r.currency === 'USD')
  if (!usdRate) throw new Error('USD rate unavailable')
  return { netUsd: usd * (1 - getIvanFee(usd)), verification: 'minimal' }
}

export const ivanConfig = {
  settlementType: 'cashUsd',
  maxUsd: MAX_USD,
  getQuote: getIvanQuote
}
