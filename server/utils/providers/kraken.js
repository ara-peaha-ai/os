const toKrakenSymbol = (currency) => currency === 'BTC' ? 'XBT' : currency
const getFee = (source) => source === 'BTC' ? 0.0025 : 0.002

export const getKrakenRate = async (source, target) => {
  const pair = `${toKrakenSymbol(source)}${toKrakenSymbol(target)}`
  const response = await $fetch(`https://api.kraken.com/0/public/Ticker?pair=${pair}`)
  if (response.error?.length) throw createError({ statusCode: 502, message: response.error[0] })
  const ticker = Object.values(response.result)[0]
  const price = parseFloat(ticker.c[0])
  const fee = getFee(source)
  return { price, priceAfterFee: price * (1 - fee) }
}
