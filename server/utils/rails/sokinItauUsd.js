// Rail: USDT → Sokin → USD bank via SWIFT.
// Chains Itaú receiving SWIFT fee (60.50 USD) on top of Sokin's 10 USD out fee.
// TODO: replace static availability with Sokin API call to check if local rail is available for the requested amount and timing.

export const getSokinItauUsdQuote = async (usd) => {
  const sokinQuote = await getSokinBankUsdQuote(usd)
  if (!sokinQuote) return null
  return getItauBankUsdQuote(sokinQuote.netUsd)
}

export const sokinItauUsdConfig = {
  settlementType: 'bankUsd',
  maxUsd: null,
  getQuote: getSokinItauUsdQuote
}
