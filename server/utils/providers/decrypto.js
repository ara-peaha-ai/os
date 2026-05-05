// OTC desk — settles to any local bank account in the destination currency.
// Applies a currency conversion fee on top of the OTC spread.
const CONVERSION_FEE = 0.0025

const getDecryptoFee = (usd) => usd <= 25_000 ? 0.01 : 0.0075

export const getDecryptoQuote = async (usd) => {
  const fee = getDecryptoFee(usd)
  const netUsd = usd * (1 - fee) * (1 - CONVERSION_FEE)
  const usdPygRate = await getBcpUsdPygRate()
  return { netUsd, netPyg: usdPygRate ? netUsd * usdPygRate : null, fee, usdPygRate }
}
