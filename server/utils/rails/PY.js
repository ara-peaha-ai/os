export const pyX4tFee = 0.0289

export const pyRails = [
  {
    key: 'cashPickup',
    docs: 'minimal',
    maxAmount: 50_000,
    getQuote: (usd) => getIvanQuote(usd)
  },
  {
    key: 'cashCourier',
    docs: 'minimal',
    maxAmount: null,
    getQuote: (usd) => getJimQuote(usd)
  },
  {
    key: 'bankWire',
    docs: 'standard',
    maxAmount: 75_000,
    getQuote: (usd) => getKrakenWiseQuote(usd)
  },
  {
    key: 'bankOtc',
    docs: 'standard',
    maxAmount: null,
    getQuote: (usd) => getDecryptoQuote(usd)
  }
]
