export default defineEventHandler(async (event) => {
  const { amount } = getQuery(event)
  const usd = parseFloat(amount)
  if (!usd || usd <= 0 || usd > 500000) throw createError({ statusCode: 400, message: 'Amount must be between 1 and 500,000 USD' })

  const [btcRateData, jimChacoQ, krakenWiseQ] = await Promise.all([
    getKrakenRate('BTC', 'USD'),
    getJimQuote(usd).catch(() => null),
    usd <= 75000 ? getKrakenWiseQuote(usd).catch(() => null) : Promise.resolve(null)
  ])

  const ivanChacoQ = usd <= 50000 ? await getIvanQuote(usd).catch(() => null) : null

  // Decrypto: OTC desk, settles to any local bank account in the destination currency
  // 0.25% currency conversion applied on Decrypto's net USD
  const decryptoFee = usd <= 25000 ? 0.01 : 0.0075
  const decryptoUsNetUsd = usd * (1 - decryptoFee) * (1 - 0.0025)

  // P2Pagos commission applied on provider net
  const p2pagosRate = usd >= 50000 ? 0.005 : usd >= 5000 ? 0.01 : 0.02

  const applyCommission = (netUsd, netPyg) => {
    if (netUsd == null) return { usd: null, pyg: netPyg ?? null, commission: null }
    const commission = netUsd * p2pagosRate
    return {
      usd: netUsd * (1 - p2pagosRate),
      pyg: netPyg != null ? netPyg * (1 - p2pagosRate) : null,
      commission
    }
  }

  const ivanBase = ivanChacoQ != null ? applyCommission(ivanChacoQ.netUsd, ivanChacoQ.netPyg) : { usd: null, pyg: null, commission: null }
  const jimAvailable = jimChacoQ != null && (jimChacoQ.netPyg ?? 0) > 0
  const jimBase = jimAvailable ? applyCommission(jimChacoQ.netUsd, jimChacoQ.netPyg) : { usd: null, pyg: null, commission: null }
  const wireBase = krakenWiseQ != null ? applyCommission(krakenWiseQ.netUsd, null) : { usd: null, pyg: null, commission: null }
  const otcBase = applyCommission(decryptoUsNetUsd, null)

  const x4tNetUsd = usd * (1 - 0.0289)

  return {
    amount: usd,
    p2pagosRate,
    x4tNetUsd,
    btcRate: btcRateData.price,
    btcAmount: usd / btcRateData.price,
    channels: {
      cashPickup: { ...ivanBase, available: ivanChacoQ != null, docs: 'minimal' },
      cashCourier: { ...jimBase, available: jimAvailable, docs: 'minimal' },
      bankWire: { ...wireBase, available: krakenWiseQ != null, docs: 'standard' },
      bankOtc: { ...otcBase, available: true, docs: 'standard' }
    }
  }
})
