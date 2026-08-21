---
draft: true
---
# dLocal Paraguay Cashout Benchmark: USD & USDT

[DLocal](https://www.dlocal.com/our-solution/payouts/) is the business standard for many B2C providers such as [Remitly](https://www.remitly.com/), [Paysend](https://paysend.com/) and [Belo app](https://www.belo.app).

This document models the estimated transactional leaks and final payout volumes for a **50,000 USD/USDT** cross-border cashout to Paraguay (PYG) via dLocal's standard institutional rails. 

### Core Parameters
*   **Initial Capital:** 50,000.00 USD / USDT
*   **Mid-Market Nominal Rate (USD/PYG):** 1 USD = 6,105.88 PYG
*   **Crypto Mid-Market Rate (USDT/PYG):** 1 USDT = 6,100.00 PYG

---

## 1. Traditional Rail: USD to PYG (Wire / Local Payout)


| Cost Component / Parameter | Value / Impact | Notes / Calculations |
| :--- | :--- | :--- |
| **Initial Capital** | 50,000.00 USD | Baseline funds |
| **Theoretical Market Value** | 305,294,000 PYG | Fair market value without friction |
| **Applied Exchange Rate** | ~5,953.23 PYG | Reflects a standard -2.50% dLocal FX Spread |
| **Gross Converted Amount** | 297,661,500 PYG | Total local volume before local network fees |
| **Transaction/Payout Fee** | 13,394,768 PYG | Standard local partner deduction (4.50%) |
| **Net Received Amount (PYG)**| **284,266,732 PYG** | **Final liquidity landed in Paraguayan bank** |
| **Total Equivalent Leak** | ~$3,443.78 USD | Cumulative friction of **6.88%** |

---

## 2. Crypto Rail: USDT to PYG (Stablecoin Full)


| Cost Component / Parameter | Value / Impact | Notes / Calculations |
| :--- | :--- | :--- |
| **Initial Capital** | 50,000.00 USDT | Baseline crypto assets |
| **Theoretical Market Value** | 305,294,000 PYG | Fair market value without friction |
| **Crypto Processing Fee** | 750.00 USDT | Standard -1.50% dLocal stablecoin intake fee |
| **Net Capital to Convert** | 49,250.00 USDT | Capital left for local fiat off-ramping |
| **Applied Exchange Rate** | ~5,917.00 PYG | Expanded -3.00% Crypto-to-Fiat FX Spread |
| **Gross Converted Amount** | 291,412,250 PYG | Total fiat volume before local payouts |
| **Local Payout Fee** | 13,113,551 PYG | Standard local network routing fee (4.50%) |
| **Net Received Amount (PYG)**| **278,298,699 PYG** | **Final liquidity landed in Paraguayan bank** |
| **Total Equivalent Leak** | ~$4,377.26 USDT | Cumulative friction of **8.75%** |

---

## Summary of Optimization Gaps

*   **The Crypto Penalty:** Switching from fiat (USD) to stablecoin (USDT) within dLocal's network triggers an extra **1.87% value drop** (~$933.48 equivalent loss on a 50k transfer).
*   **The Targets to Beat:** To prove superiority, your competitive solution must bypass the double-layer fee structure (processing + payout) and keep the total combined friction well below **6.88% for USD** and **8.75% for USDT**.

## Comparision with Paguaitu solution

With our multi-rail solution you can get in the same day:


| Cost Component / Parameter | Value / Impact | Notes / Calculations |
| :--- | :--- | :--- |
| **Initial Capital** | 50,000.00 USDT | Baseline crypto assets |
| **Theoretical Market Value** | 305,294,000 PYG | Fair market value without friction |
| **Total Processing Fee** | 3.594.000 PYG or 588.90 USD| Our all-inclusive fee |
| **Net Received Amount (PYG)**| **301,700,000 PYG** | **Final liquidity landed in Paraguayan bank** |
| **Total Equivalent Leak** | ~588.90 USDT | Cumulative friction of **1.17%** |

**6X-14X expense reduction** with our multi-rails solution with a **saving up to 25,041,419 PYG or 4,102.57 USD**

| Provider | Payin | Payout to a PY bank | Service fee |
| - | - | - | - |
| DLocal | 50,000 USDT | 278,298,699 PYG | 26,995,301 PYG / 8.84 % |
| DLocal | 50,000 USD | 284,266,732 PYG | 21,027,268 PYG / 6.89% |
| Paguaitu | 50,000 USD/USDT | 301,700,000 PYG | 3,594,000 PYG / 1.17% |
| Paguaitu | 50,000 USD/USDT | 49,680 USD | 320 USD / 0.64% |
