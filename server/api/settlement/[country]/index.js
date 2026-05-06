export default defineEventHandler(async (event) => {
  const country = getRouterParam(event, 'country').toUpperCase()

  const config = SETTLEMENT_COUNTRIES[country]
  if (!config)
    throw createError({ statusCode: 404, message: 'Country not supported' })

  return buildPresetQuotes(config)
})
