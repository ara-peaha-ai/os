export default defineEventHandler(async () => {
  const rate = await getBcpUsdPygRate()
  if (!rate) throw createError({ statusCode: 502, message: 'BCP rate unavailable' })
  return { usdPygRate: rate }
})
