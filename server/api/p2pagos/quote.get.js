const getP2pagosFee = (amountUsd) => {
  if (amountUsd >= 50_000) return 0.0025
  if (amountUsd >= 10_000) return 0.005
  return 0.01
}

export default defineEventHandler(async (event) => {
  const { amount, currency } = getQuery(event)
  const parsedAmount = parseFloat(amount)

  let amountUsd, amountPyg, bcpRate

  if (currency === 'PYG') {
    bcpRate = await getBcpUsdPygRate()
    amountPyg = parsedAmount
    amountUsd = parsedAmount / bcpRate
  } else {
    amountUsd = parsedAmount
    amountPyg = null
    bcpRate = null
  }

  const fee = getP2pagosFee(amountUsd)
  const feeUsd = amountUsd * fee

  return {
    invoiceAmount: parsedAmount,
    invoiceCurrency: currency ?? 'USD',
    bcpUsdPygRate: bcpRate,
    amountUsd,
    fee,
    feeUsd,
  }
})
