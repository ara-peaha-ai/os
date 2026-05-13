// Jim — cash PYG home delivery in Paraguay.
// Max: 50,000 USD.
// Fee: 2.0% below 2,000 USD | 1.5% up to 25,000 USD | 1.25% up to 50,000 USD | 1.0% at exactly 50,000 USD.
// Fixed delivery fee: 100,000 PYG regardless of amount.
// CambiosChaco USD purchase rate used for USD → PYG conversion.
// verification: minimal (none to be transparent internally).

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
