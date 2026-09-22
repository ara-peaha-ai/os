const getIvanFee = (usd) => {
  if (usd <= 5_000) return 0.025
  if (usd <= 25_000) return 0.02
  if (usd <= 100_000) return 0.015
  if (usd <= 200_000) return 0.010
  return 0.0075
}

export const getIvanQuote = async (usd) => {
  const rates = await getCambiosChacoRates()
  const usdRate = rates.find(r => r.currency === 'USD')
  if (!usdRate) throw new Error('USD rate unavailable')
  return { netUsd: usd * (1 - getIvanFee(usd)), verification: 'minimal' }
}

export const ivanConfig = {
  settlementType: 'cashUsd',
  maxUsd: null,
  getQuote: getIvanQuote
}
