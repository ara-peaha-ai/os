const getIvanFee = (amount) => {
  if (amount <= 5_000) return 0.025
  if (amount <= 25_000) return 0.02
  return 0.015
}

const getJimFee = (amount) => {
  if (amount >= 50_000) return 0.01
  if (amount >= 25_000) return 0.0125
  if (amount >= 2_000) return 0.015
  return 0.02
}

const DELIVERY_FEE_PYG = 100_000

const getP2pagosFee = (amount) => {
  if (amount >= 50_000) return 0.005
  if (amount >= 5_000) return 0.01
  return 0.02
}

export const getIvanQuote = async (amount) => {
  const rates = await getCambiosChacoRates()
  const usdRate = rates.find(r => r.currency === 'USD')
  if (!usdRate) throw createError({ statusCode: 502, message: 'USD rate unavailable' })
  const fee = getIvanFee(amount)
  const netUsd = amount * (1 - fee)
  return { netUsd, netPyg: netUsd * usdRate.purchase, fee, usdPygRate: usdRate.purchase }
}

export const getJimQuote = async (amount) => {
  const rates = await getCambiosChacoRates()
  const usdRate = rates.find(r => r.currency === 'USD')
  if (!usdRate) throw createError({ statusCode: 502, message: 'USD rate unavailable' })
  const fee = getJimFee(amount)
  const netPyg = amount * usdRate.purchase * (1 - fee) - DELIVERY_FEE_PYG
  const netUsd = netPyg > 0 ? netPyg / usdRate.purchase : null
  return { netPyg, netUsd, fee, usdPygRate: usdRate.purchase }
}

export const getP2pagosQuote = async (amount) => {
  const usdPygRate = await getBcpUsdPygRate()
  if (!usdPygRate) throw createError({ statusCode: 502, message: 'BCP rate unavailable' })
  const fee = getP2pagosFee(amount)
  const netUsd = amount * (1 - fee)
  return { netUsd, netPyg: netUsd * usdPygRate, fee, usdPygRate }
}

export const getKrakenWiseQuote = async (amount) => {
  const [usdtEur, wiseRates] = await Promise.all([
    getKrakenRate('USDT', 'EUR'),
    (() => {
      const wiseFetch = useWiseFetch()
      return wiseFetch('https://api.wise.com/v1/rates?source=EUR&target=USD')
    })()
  ])
  const eurUsdRate = wiseRates[0]?.rate
  if (!eurUsdRate) throw createError({ statusCode: 502, message: 'Wise rate unavailable' })
  const eurFromKraken = amount * usdtEur.priceAfterFee
  const swiftFee = getSwiftFeeUsd('PY')
  const netUsd = (eurFromKraken - 1) * eurUsdRate - swiftFee
  const usdPygRate = await getBcpUsdPygRate()
  return { netUsd, netPyg: usdPygRate ? netUsd * usdPygRate : null, usdPygRate }
}
