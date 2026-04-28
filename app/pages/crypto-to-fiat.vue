<script setup>
const mainSource = ref('USDT')
const invoiceUsd = ref(1000)

const sourceOptions = ['USDT', 'USDC', 'BTC']
const isStablecoin = computed(() => ['USDT', 'USDC'].includes(mainSource.value))

const { data: krakenSourceEurRate } = await useFetch('/api/kraken/rates', {
  query: computed(() => ({ source: mainSource.value, target: 'EUR' }))
})
const { data: krakenBtcUsdRate } = await useFetch('/api/kraken/rates', {
  query: { source: 'BTC', target: 'USD' }
})
const { data: wiseRateRaw } = await useFetch('/api/wise/retes', {
  query: { source: 'EUR', target: 'USD' }
})
const { data: cambiosChacoRates } = await useFetch('/api/cambioschaco/rates')
const { data: bcpRateData } = await useFetch('/api/bcp/rate')

const wiseEurUsdRate = computed(() => wiseRateRaw.value?.[0]?.rate)
const cambiosChacoUsdPurchase = computed(() => cambiosChacoRates.value?.find(r => r.currency === 'USD')?.purchase)

const eurFromKraken = computed(() => {
  if (!krakenSourceEurRate.value) return null
  if (isStablecoin.value) return invoiceUsd.value * krakenSourceEurRate.value.priceAfterFee
  if (!krakenBtcUsdRate.value) return null
  const btcAmount = invoiceUsd.value / krakenBtcUsdRate.value.priceAfterFee
  return btcAmount * krakenSourceEurRate.value.priceAfterFee
})

const ivanUsd = computed(() => invoiceUsd.value * 0.98)
const ivanPyg = computed(() => cambiosChacoUsdPurchase.value ? ivanUsd.value * cambiosChacoUsdPurchase.value : null)

const bankUsd = computed(() => {
  if (!eurFromKraken.value || !wiseEurUsdRate.value) return null
  return (eurFromKraken.value - 1) * wiseEurUsdRate.value - 21.68
})
const bankPyg = computed(() => {
  if (!bankUsd.value || !bcpRateData.value) return null
  return bankUsd.value * bcpRateData.value.usdPygRate
})

const usd = (v) => v != null ? v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : '—'
const pyg = (v) => v != null ? `₲ ${Math.round(v).toLocaleString('es-PY')}` : '—'
</script>

<template>
  <div class="max-w-lg mx-auto p-6 space-y-6">
    <div class="flex gap-3">
      <UInput
        v-model.number="invoiceUsd"
        type="number"
        placeholder="Invoice (USD)"
        class="flex-1"
      />
      <USelect
        v-model="mainSource"
        :items="sourceOptions"
      />
    </div>

    <UTable
      :columns="[
        { key: 'rail', label: 'Rail' },
        { key: 'usd', label: 'USD', class: 'text-right' },
        { key: 'pyg', label: 'PYG', class: 'text-right' }
      ]"
      :rows="[
        { rail: 'Cash (Ivan)', usd: usd(ivanUsd), pyg: pyg(ivanPyg) },
        { rail: 'Bank PY (Kraken + Wise)', usd: usd(bankUsd), pyg: pyg(bankPyg) }
      ]"
    />
  </div>
</template>
