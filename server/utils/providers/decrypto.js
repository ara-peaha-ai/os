// Decrypto — LATAM crypto exchange, USD bank settlement.
// Conversion fee: 0.25% (always applied).
// Settlement fee: 1.00% for amounts up to 25,000 USD, 0.75% above.
// No cap on amount.
// verification: standard.

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
