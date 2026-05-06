const MAX_USD = 50_000
const DELIVERY_FEE_PYG = 100_000

const getJimFee = (usd) => {
  if (usd >= 50_000) return 0.01
  if (usd >= 25_000) return 0.0125
  if (usd >= 2_000) return 0.015
  return 0.02
}

export const getJimQuote = async (usd) => {
  if (usd > MAX_USD) return null
  const rates = await getCambiosChacoRates()
  const usdRate = rates.find(r => r.currency === 'USD')
  if (!usdRate) throw new Error('USD rate unavailable')
  const netNational = usd * usdRate.purchase * (1 - getJimFee(usd)) - DELIVERY_FEE_PYG
  if (netNational <= 0) return null
  return { netNational, verification: 'minimal' }
}

export const jimConfig = {
  settlementType: 'cashLocal',
  maxUsd: MAX_USD,
  getQuote: getJimQuote
}
