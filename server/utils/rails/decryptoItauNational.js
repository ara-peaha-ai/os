// Rail: USDT → Decrypto → USD → SWIFT → recipient PYG bank account in Paraguay.
// Decrypto fee: 1.00% (up to 25,000 USD) or 0.75% (above) + 0.25% conversion fee.
// Itaú incoming SWIFT fee: 60.50 USD equivalent converted to PYG at live BCP rate. To be confirmed if appropieted. 
// Itaú used as reference — actual fees vary slightly by receiving bank.

export const getDecryptoItauNationalQuote = async (usd) => {
  const decryptoQuote = await getDecryptoQuote(usd)
  if (!decryptoQuote) return null
  return getItauBankLocalQuote(decryptoQuote.netUsd)
}

export const decryptoItauNationalConfig = {
  settlementType: 'bankLocal',
  maxUsd: null,
  getQuote: getDecryptoItauNationalQuote
}
