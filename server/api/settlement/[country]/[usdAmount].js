export default defineEventHandler(async (event) => {
  const country = getRouterParam(event, 'country').toUpperCase()
  const usd = parseFloat(getRouterParam(event, 'usdAmount'))

  if (!usd || usd <= 0 || usd > 500_000)
    throw createError({ statusCode: 400, message: 'Amount must be between 1 and 500,000 USD' })

  const config = SETTLEMENT_COUNTRIES[country]
  if (!config)
    throw createError({ statusCode: 404, message: 'Country not supported' })

  return buildSettlementQuote(usd, config)
})
