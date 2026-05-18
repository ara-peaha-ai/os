// USD
// To receive: 38.50 USD
// To use SWIFT: 22.00 USD

// PYG
// To be confirmed
// For now implemeneted as USD converted at BCP exchange rate.

// EUR
// To receive: 38.50 EUR
// To use SWIFT: 15.00 EUR
// Not coded yet.

const SWIFT_FEE_USD = 38.50 + 22.00

export const getItauBankUsdQuote = async (usd) => {
  const netUsd = usd - SWIFT_FEE_USD
  if (netUsd <= 0) return null
  return { netUsd, verification: 'standard' }
}

export const getItauBankLocalQuote = async (usd) => {
  const bcpRate = await getBcpUsdPygRate()
  const netNational = (usd - SWIFT_FEE_USD) * bcpRate
  if (netNational <= 0) return null
  return { netNational, verification: 'standard' }
}

export const itauBankUsdConfig = {
  settlementType: 'bankUsd',
  maxUsd: null,
  getQuote: getItauBankUsdQuote
}

export const itauBankLocalConfig = {
  settlementType: 'bankLocal',
  maxUsd: null,
  getQuote: getItauBankLocalQuote
}
