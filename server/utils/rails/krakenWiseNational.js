// Rail: USDT → Kraken (0.2% fee) → EUR → Wise real quote → local currency → recipient bank.
// Wise quote covers their conversion spread and transfer fee.
// Available in BR and planned in MX (ETA 2026).

export const getKrakenWiseNationalQuote = async (usd, currency) => {
  const usdtEur = await getKrakenRate('USDT', 'EUR')
  const eurFromKraken = usd * usdtEur.priceAfterFee - usdtEur.withdrawalFee
  const { targetAmount: netNational } = await getWiseLocalQuote(eurFromKraken, 'EUR', currency)
  return { netNational, verification: 'enhanced' }
}

export const krakenWisePygConfig = {
  settlementType: 'bankLocal',
  getQuote: (usd) => getKrakenWiseNationalQuote(usd, 'PYG')
}
