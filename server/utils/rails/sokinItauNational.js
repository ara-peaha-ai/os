// Rail: USDT → Sokin → PYG local bank (SIPAP/LBTR).
// TODO: replace static availability with Sokin API call to check if local rail is available for the requested amount and timing.

export const getSokinItauNationalQuote = async (usd) => {
  return getSokinBankLocalQuote(usd)
}

export const sokinItauNationalConfig = {
  settlementType: 'bankLocal',
  maxUsd: null,
  getQuote: getSokinItauNationalQuote
}
