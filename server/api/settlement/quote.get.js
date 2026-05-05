const COUNTRIES = {
  PY: { rails: pyRails, x4tFee: pyX4tFee }
}

export default defineEventHandler(async (event) => {
  const { amount, country = 'PY' } = getQuery(event)
  const usd = parseFloat(amount)
  if (!usd || usd <= 0 || usd > 500_000)
    throw createError({ statusCode: 400, message: 'Amount must be between 1 and 500,000 USD' })

  const config = COUNTRIES[country?.toUpperCase()]
  if (!config) return { amount: usd, channels: {} }

  const p2pagosRate = getP2pagosRate(usd)
  const activeRails = config.rails.filter(r => !r.maxAmount || usd <= r.maxAmount)

  const [btcRateData, ...quoteResults] = await Promise.all([
    getKrakenRate('BTC', 'USD'),
    ...activeRails.map(r => r.getQuote(usd).catch(() => null))
  ])

  const channels = Object.fromEntries(
    activeRails.map((rail, i) => {
      const q = quoteResults[i]
      const available = q != null && q.netUsd != null
      const base = available
        ? applyCommission(q.netUsd, q.netPyg, p2pagosRate)
        : { usd: null, pyg: null, commission: null }
      return [rail.key, { ...base, available, docs: rail.docs }]
    })
  )

  return {
    amount: usd,
    p2pagosRate,
    x4tNetUsd: usd * (1 - config.x4tFee),
    btcRate: btcRateData.price,
    btcAmount: usd / btcRateData.price,
    channels
  }
})
