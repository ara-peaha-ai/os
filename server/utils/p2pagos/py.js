export const getP2pagosRate = (usd) => {
  if (usd >= 50_000) return 0.005
  if (usd >= 5_000) return 0.01
  return 0.015
}
