const DOC_SCALE = ['minimal', 'standard', 'enhanced']

export const worstDocs = (...levels) =>
  levels.reduce((worst, l) => DOC_SCALE.indexOf(l) > DOC_SCALE.indexOf(worst) ? l : worst)

export const getP2pagosRate = (usd) => {
  if (usd >= 50_000) return 0.005
  if (usd >= 5_000) return 0.01
  return 0.02
}

export const applyCommission = (netUsd, netPyg, rate) => {
  if (netUsd == null) return { usd: null, pyg: netPyg ?? null, commission: null }
  const commission = netUsd * rate
  return {
    usd: netUsd * (1 - rate),
    pyg: netPyg != null ? netPyg * (1 - rate) : null,
    commission
  }
}
