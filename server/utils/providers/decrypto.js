const CONVERSION_FEE = 0.0025

const getDecryptoFee = (usd) => usd <= 25_000 ? 0.01 : 0.0075

export const getDecryptoQuote = async (usd) => {
  const netUsd = usd * (1 - getDecryptoFee(usd)) * (1 - CONVERSION_FEE)
  return { netUsd, verification: 'standard' }
}

export const decryptoConfig = {
  settlementType: 'bankUsd',
  maxUsd: null,
  getQuote: getDecryptoQuote
}

// Cash pickup rail (AR): pays a 1% premium over the USDT received — 1 USDT in,
// 1.01 USD cash out — instead of deducting a fee like the bank rail above.
const CASH_PREMIUM = 1.01

export const getDecryptoCashUsdQuote = async (usd) => {
  const netUsd = usd * CASH_PREMIUM
  return { netUsd, verification: 'standard' }
}

export const decryptoCashUsdConfig = {
  settlementType: 'cashUsd',
  maxUsd: null,
  getQuote: getDecryptoCashUsdQuote
}
