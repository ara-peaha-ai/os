export default defineEventHandler(async (event) => {
  const { source, target, amount, country } = getQuery(event)
  const wiseFetch = useWiseFetch()
  const data = await wiseFetch(`https://api.wise.com/v1/rates?source=${source}&target=${target}`)

  const rate = data[0]?.rate
  if (!rate || !amount) return data

  const grossTarget = parseFloat(amount) * rate
  const swiftFeeUsd = getSwiftFeeUsd(country)
  const netReceivedUsd = swiftFeeUsd !== null ? grossTarget - swiftFeeUsd : null

  return {
    rate,
    grossUsd: grossTarget,
    swiftFeeUsd,
    netReceivedUsd
  }
})
