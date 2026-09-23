export default defineEventHandler(async (event) => {
  const country = getRouterParam(event, 'country').toUpperCase()

  const config = SETTLEMENT_COUNTRIES[country]
  if (!config)
    throw createError({ statusCode: 404, message: 'Country not supported' })

  // ?amounts=10000,120000 overrides the two default preset amounts (see FeeSimulator's `size`)
  const { amounts } = getQuery(event)
  const presetAmounts = amounts
    ? String(amounts).split(',').map(Number).filter(n => Number.isFinite(n) && n > 0)
    : undefined

  return buildPresetQuotes(config, presetAmounts?.length === 2 ? presetAmounts : undefined)
})
