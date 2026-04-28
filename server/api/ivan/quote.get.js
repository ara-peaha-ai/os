const IVAN_FEE = 0.02

export default defineEventHandler(async (event) => {
  const { amount, currency } = getQuery(event)
  const usdtAmount = parseFloat(amount)
  const targetCurrency = currency ?? 'USD'

  if (targetCurrency === 'PYG') {
    const rates = await $fetch('/api/cambioschaco/rates')
    const usdRate = rates.find(r => r.currency === 'USD')
    if (!usdRate) throw createError({ statusCode: 502, message: 'USD rate unavailable' })

    const grossPyg = usdtAmount * usdRate.purchase
    return {
      usdtAmount,
      targetCurrency,
      usdPygRate: usdRate.purchase,
      fee: IVAN_FEE,
      grossPyg,
      netPyg: grossPyg * (1 - IVAN_FEE)
    }
  }

  return {
    usdtAmount,
    targetCurrency,
    fee: IVAN_FEE,
    netUsd: usdtAmount * (1 - IVAN_FEE)
  }
})
