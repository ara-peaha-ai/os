const X4T_FEE = 0.0289

export const getPyX4tComparison = async (usd) => {
  const usdPygRate = await getBcpUsdPygRate()
  const netUsd = usd * (1 - X4T_FEE)
  return {
    usd: netUsd,
    national: usdPygRate ? netUsd * usdPygRate : null,
    verification: 'enhanced'
  }
}
