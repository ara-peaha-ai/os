// Rail: USDT → Kraken (0.2% fee) → EUR → Wise real quote → USD → recipient bank via SWIFT.
// Wise quote covers their conversion spread and transfer fee.
// Recipient bank's incoming SWIFT fee deducted separately on top (varies by country, see wise.js table).
// Available in BR and planned in MX (ETA 2026).

export const getKrakenWiseUsdQuote = async (usd, country) => {
  const usdtEur = await getKrakenRate('USDT', 'EUR')
  const eurFromKraken = usd * usdtEur.priceAfterFee - usdtEur.withdrawalFee
  const { targetAmount } = await getWiseLocalQuote(eurFromKraken, 'EUR', 'USD')
  const netUsd = targetAmount - getSwiftFeeUsd(country)
  return { netUsd, verification: 'enhanced' }
}

export const krakenWisePyUsdConfig = {
  settlementType: 'bankUsd',
  getQuote: (usd) => getKrakenWiseUsdQuote(usd, 'PY')
}
