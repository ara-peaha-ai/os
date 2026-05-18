// Sokin — international fintech, LATAM settlement.
// Receiving SWIFT or ACH in USD: free.
// FX fee (USD → LATAM local currencies): 0.5% on mid-market rate.
// SWIFT out to LATAM: 10 USD flat.
// Local rail to LATAM (SIPAP/LBTR for PY, SPEI for MX, PIX for BR, etc.): 5 USD flat.
// Supported local currencies: ARS, BOB, BRL, CLP, COP, CRC, DOP, GTQ, HNL, MXN, PEN, PYG, UYU.
// bankLocal currently implemented for PYG only using BCP rate — other currencies need their own rate source.
// Both SWIFT and locals are received from Sokin/PlataCapital, so in Paraguay we are forced to usethe local rail for SoF because SWIFT from 3rd party will not be accepted.
// USDC, USDT, USDS (Sky dollar), PYUSD, and EURC, across Tron and Ethereum-based blockchain networks. BTC not supported.

const SOKIN_SWIFT_FEE_USD = 10
const SOKIN_LOCAL_FEE_USD = 5
const SOKIN_FX_FEE = 0.005

export const getSokinBankUsdQuote = async (usd) => {
  const netUsd = usd - SOKIN_SWIFT_FEE_USD
  if (netUsd <= 0) return null
  return { netUsd, verification: 'standard' }
}

export const getSokinBankLocalQuote = async (usd) => {
  const bcpRate = await getBcpUsdPygRate()
  const netNational = (usd - SOKIN_LOCAL_FEE_USD) * (1 - SOKIN_FX_FEE) * bcpRate
  if (netNational <= 0) return null
  return { netNational, verification: 'standard' }
}

export const sokinBankUsdConfig = {
  settlementType: 'bankUsd',
  maxUsd: null,
  getQuote: getSokinBankUsdQuote
}

export const sokinBankLocalConfig = {
  settlementType: 'bankLocal',
  maxUsd: null,
  getQuote: getSokinBankLocalQuote
}
