const getIvanFee = (amount) => {
  if (amount <= 5_000) return 0.025
  if (amount <= 25_000) return 0.02
  return 0.015
}

export default defineEventHandler(async (event) => {
  const { amount, currency } = getQuery(event)
  const usdtAmount = parseFloat(amount)
  const targetCurrency = currency ?? 'USD'
  const fee = getIvanFee(usdtAmount)

  if (targetCurrency === 'PYG') {
    const rates = await $fetch('/api/cambioschaco/rates')
    const usdRate = rates.find(r => r.currency === 'USD')
    if (!usdRate) throw createError({ statusCode: 502, message: 'USD rate unavailable' })

    const grossPyg = usdtAmount * usdRate.purchase
    return {
      usdtAmount,
      targetCurrency,
      usdPygRate: usdRate.purchase,
      fee,
      grossPyg,
      netPyg: grossPyg * (1 - fee)
    }
  }

  return {
    usdtAmount,
    targetCurrency,
    fee,
    netUsd: usdtAmount * (1 - fee)
  }
})
