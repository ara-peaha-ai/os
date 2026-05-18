export const getKrakenWiseNationalQuote = async (usd, currency) => {
  const wiseFetch = useWiseFetch()
  const [usdtEur, wiseUsdRates] = await Promise.all([
    getKrakenRate('USDT', 'EUR'),
    wiseFetch('https://api.wise.com/v1/rates?source=EUR&target=USD')
  ])
  const eurFromKraken = usd * usdtEur.priceAfterFee - 1
  const { targetAmount: netNational } = await getWiseLocalQuote(eurFromKraken, 'EUR', currency)
  const eurUsdRate = wiseUsdRates[0]?.rate
  const netUsd = eurUsdRate ? eurFromKraken * eurUsdRate : null
  return { netNational, netUsd, verification: 'enhanced' }
}

export const krakenWisePygConfig = {
  settlementType: 'bankLocal',
  getQuote: (usd) => getKrakenWiseNationalQuote(usd, 'PYG')
}
