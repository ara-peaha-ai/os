export const getKrakenWiseUsdQuote = async (usd, country) => {
  const wiseFetch = useWiseFetch()
  const [usdtEur, wiseRates] = await Promise.all([
    getKrakenRate('USDT', 'EUR'),
    wiseFetch('https://api.wise.com/v1/rates?source=EUR&target=USD')
  ])
  const eurUsdRate = wiseRates[0]?.rate
  if (!eurUsdRate) throw new Error('Wise rate unavailable')
  const eurFromKraken = usd * usdtEur.priceAfterFee - 1
  const netUsd = eurFromKraken * eurUsdRate - getSwiftFeeUsd(country)
  return { netUsd, verification: 'enhanced' }
}

export const krakenWisePyUsdConfig = {
  settlementType: 'bankUsd',
  getQuote: (usd) => getKrakenWiseUsdQuote(usd, 'PY')
}
