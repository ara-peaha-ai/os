// Kraken public API — live spot price with taker fee applied.
// USDT → any: 0.2% fee.
// BTC → any: 0.25% fee.
// Returns both raw price and priceAfterFee (what we actually receive after Kraken takes its cut).
//
// Withdrawal fees — included automatically in getKrakenRate as withdrawalFee (in target currency):
// EUR via SEPA: 1 EUR flat. Min 2 EUR. 0-5 business days.
// USD via SWIFT: 13 USD flat. Min 100 USD. 1-5 business days.

export const KRAKEN_SEPA_FEE_EUR = 1
export const KRAKEN_SWIFT_FEE_USD = 13

const WITHDRAWAL_FEES = { EUR: KRAKEN_SEPA_FEE_EUR, USD: KRAKEN_SWIFT_FEE_USD }

const toKrakenSymbol = (currency) => currency === 'BTC' ? 'XBT' : currency
const getFee = (source) => source === 'BTC' ? 0.0025 : 0.002

export const getKrakenRate = async (source, target) => {
  const pair = `${toKrakenSymbol(source)}${toKrakenSymbol(target)}`
  const response = await $fetch(`https://api.kraken.com/0/public/Ticker?pair=${pair}`)
  if (response.error?.length) throw createError({ statusCode: 502, message: response.error[0] })
  const ticker = Object.values(response.result)[0]
  const price = parseFloat(ticker.c[0])
  const fee = getFee(source)
  const withdrawalFee = WITHDRAWAL_FEES[target] ?? 0
  return { price, priceAfterFee: price * (1 - fee), withdrawalFee }
}
