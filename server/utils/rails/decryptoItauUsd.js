// Rail: USDT → Decrypto → USD → SWIFT → recipient USD bank account in Paraguay.
// Decrypto fee: 1.00% (up to 25,000 USD) or 0.75% (above) + 0.25% conversion fee.
// Itaú incoming SWIFT fee: 38.50 + 22.00 = 60.50 USD flat, deducted on arrival.
// Itaú used as reference — actual fees vary slightly by receiving bank.

export const getDecryptoItauUsdQuote = async (usd) => {
  const decryptoQuote = await getDecryptoQuote(usd)
  if (!decryptoQuote) return null
  return getItauBankUsdQuote(decryptoQuote.netUsd)
}

export const decryptoItauUsdConfig = {
  settlementType: 'bankUsd',
  maxUsd: null,
  getQuote: getDecryptoItauUsdQuote
}
