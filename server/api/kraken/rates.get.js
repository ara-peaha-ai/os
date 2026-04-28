// 0.25% maker — Spot Crypto (BTC, ETH, ...), tier $0+
// 0.20% maker = taker — Stablecoin/FX pairs, tier $0+
const getFee = (source) => source === 'BTC' ? 0.0025 : 0.002

const toKrakenSymbol = (currency) => {
  if (currency === 'BTC') return 'XBT'
  return currency
}

export default defineEventHandler(async (event) => {
  const { source, target } = getQuery(event)
  const pair = `${toKrakenSymbol(source)}${toKrakenSymbol(target)}`

  const response = await $fetch(`https://api.kraken.com/0/public/Ticker?pair=${pair}`)

  if (response.error?.length) {
    throw createError({ statusCode: 400, message: response.error[0] })
  }

  const ticker = Object.values(response.result)[0]
  const price = parseFloat(ticker.c[0])
  const fee = getFee(source)
  const priceAfterFee = price * (1 - fee)

  return {
    pair,
    price,
    fee,
    priceAfterFee
  }
})
