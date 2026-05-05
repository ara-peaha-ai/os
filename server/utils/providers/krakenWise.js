export const getKrakenWiseQuote = async (usd) => {
  const [usdtEur, wiseRates] = await Promise.all([
    getKrakenRate('USDT', 'EUR'),
    (() => {
      const wiseFetch = useWiseFetch()
      return wiseFetch('https://api.wise.com/v1/rates?source=EUR&target=USD')
    })()
  ])
  const eurUsdRate = wiseRates[0]?.rate
  if (!eurUsdRate) throw createError({ statusCode: 502, message: 'Wise rate unavailable' })
  const eurFromKraken = usd * usdtEur.priceAfterFee
  const swiftFee = getSwiftFeeUsd('PY')
  const netUsd = (eurFromKraken - 1) * eurUsdRate - swiftFee
  const usdPygRate = await getBcpUsdPygRate()
  return { netUsd, netPyg: usdPygRate ? netUsd * usdPygRate : null, usdPygRate }
}
