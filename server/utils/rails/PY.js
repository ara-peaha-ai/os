// Paraguay — available settlement routes:
// Cash USD:       Ivan   (up to 50,000 USD, 1.5–2.5% fee)
// Cash PYG:       Jim    (up to 50,000 USD, 1.0–2.0% fee + 100,000 PYG delivery)
// Bank USD SWIFT: Decrypto + Itaú incoming fee (60.50 USD flat)
// Bank PYG SWIFT: Decrypto + Itaú incoming fee in PYG at BCP rate
// Wise rails removed: Wise does not open accounts for EAS in Paraguay.

export const pyConfig = {
  country: 'PY',
  getComparison: getPyX4tComparison,
  providers: [
    ivanConfig,
    jimConfig,
    decryptoItauUsdConfig,
    decryptoItauNationalConfig
  ]
}
