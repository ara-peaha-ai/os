const DELIVERY_FEE_PYG = 100_000

const getJimFee = (amount) => {
  if (amount >= 50_000) return 0.01
  if (amount >= 25_000) return 0.0125
  if (amount >= 2_000) return 0.015
  return 0.02
}

export default defineEventHandler(async (event) => {
  const { amount } = getQuery(event)
  const usdtAmount = parseFloat(amount)

  const rates = await $fetch('/api/cambioschaco/rates')
  const usdRate = rates.find(r => r.currency === 'USD')

  if (!usdRate) throw createError({ statusCode: 502, message: 'USD rate unavailable' })

  const fee = getJimFee(usdtAmount)
  const grossPyg = usdtAmount * usdRate.purchase
  const afterFeePyg = grossPyg * (1 - fee)
  const netPyg = afterFeePyg - DELIVERY_FEE_PYG

  return {
    usdtAmount,
    usdPygRate: usdRate.purchase,
    fee,
    grossPyg,
    deliveryFeePyg: DELIVERY_FEE_PYG,
    netPyg,
  }
})
