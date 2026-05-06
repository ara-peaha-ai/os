const SWIFT_DEFAULT_FEE_USD = 21.71

const LATAM_SWIFT_FEES_USD = {
  AR: 22.25, BO: 14.61, CL: 21.73, CR: 13.97, DO: 9.54, EC: 9.63,
  SV: 10.18, GT: 9.98, HN: 10.02, JM: 14.60, MX: 15.69, NI: 8.39,
  PA: 13.39, PY: 21.68, PE: 35.00, SR: 15.24, UY: 26.28
}

export const getSwiftFeeUsd = (country) => {
  if (!country) return null
  return LATAM_SWIFT_FEES_USD[country.toUpperCase()] ?? SWIFT_DEFAULT_FEE_USD
}

export const useWiseFetch = () => {
  const { wiseApiToken } = useRuntimeConfig()
  return $fetch.create({
    headers: { Authorization: `Bearer ${wiseApiToken}` }
  })
}

export const getWiseLocalQuote = async (sourceAmount, sourceCurrency, targetCurrency) => {
  const wiseFetch = useWiseFetch()
  const profiles = await wiseFetch('https://api.wise.com/v1/profiles')
  const profile = profiles.find(p => p.type === 'personal') ?? profiles[0]
  if (!profile) throw new Error('Wise profile unavailable')
  const quote = await wiseFetch(`https://api.wise.com/v3/profiles/${profile.id}/quotes/`, {
    method: 'POST',
    body: { sourceCurrency, targetCurrency, sourceAmount, payOut: 'BANK_TRANSFER' }
  })
  const option = quote.paymentOptions?.find(o => o.payIn === 'BALANCE')
  if (!option) throw new Error(`Wise ${targetCurrency} BALANCE option unavailable`)
  return { targetAmount: option.targetAmount, fee: option.fee }
}
