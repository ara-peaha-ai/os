// Rail: USDT → Decrypto cash pickup (1:1.01 premium) → USD → converted to ARS
// at the blue dollar rate.
export const getDecryptoCashLocalQuote = async (usd) => {
  const decryptoQuote = await getDecryptoCashUsdQuote(usd)
  if (!decryptoQuote) return null
  const blueRate = await getBlueUsdArsRate()
  return { netNational: decryptoQuote.netUsd * blueRate, verification: 'standard' }
}

export const decryptoCashLocalConfig = {
  settlementType: 'cashLocal',
  maxUsd: null,
  getQuote: getDecryptoCashLocalQuote
}
