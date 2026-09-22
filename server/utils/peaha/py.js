const BRACKETS = [
  { from: 0, to: 500, rate: 0.1 },
  { from: 500, to: 5_000, rate: 0.0175 },
  { from: 5_000, to: 50_000, rate: 0.015 },
  { from: 50_000, to: 500_000, rate: 0.010 },
  { from: 500_000, to: Infinity, rate: 0 }
]

export const getPeahaFee = (usd) =>
  BRACKETS.reduce((fee, { from, to, rate }) => fee + Math.max(0, Math.min(usd, to) - from) * rate, 0)

export const getPeahaRate = (usd) => (usd > 0 ? getPeahaFee(usd) / usd : BRACKETS[0].rate)
