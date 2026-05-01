<script setup>
import { h } from 'vue'

const { t } = useI18n()
const route = useRoute()

const { data: pageContent } = await useAsyncData(`settlement-docs-${route.path}`, () =>
  queryCollection('content').where('path', 'LIKE', `%${route.path}`).first()
)
const invoiceUsd = ref(100000)

const { data: krakenUsdtEurRate } = await useFetch('/api/kraken/rates', {
  query: { source: 'USDT', target: 'EUR' }
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

const btcClientAmount = computed(() => {
  if (!krakenBtcUsdRate.value) return '—'
  return (invoiceUsd.value / krakenBtcUsdRate.value.price).toFixed(8)
})

const eurFromKraken = computed(() => {
  if (!krakenUsdtEurRate.value) return null
  return invoiceUsd.value * krakenUsdtEurRate.value.priceAfterFee
})

const getIvanFee = (amount) => {
  if (amount <= 5_000) return 0.025
  if (amount <= 25_000) return 0.02
  return 0.015
}
const ivanUsd = computed(() => invoiceUsd.value * (1 - getIvanFee(invoiceUsd.value)))
const ivanPyg = computed(() => cambiosChacoUsdPurchase.value ? ivanUsd.value * cambiosChacoUsdPurchase.value : null)

// X4T: 0% trading fee + 2.89% withdrawal, USDT/USDC 1:1, USD/PYG approximated at Cambios Chaco rate
const X4T_FEE = 0.0289
const x4tUsd = computed(() => invoiceUsd.value * (1 - X4T_FEE))
const x4tPyg = computed(() => cambiosChacoUsdPurchase.value ? x4tUsd.value * cambiosChacoUsdPurchase.value : null)

const bankUsd = computed(() => {
  if (!eurFromKraken.value || !wiseEurUsdRate.value) return null
  return (eurFromKraken.value - 1) * wiseEurUsdRate.value - 21.68
})
const bankPyg = computed(() => {
  if (!bankUsd.value || !bcpRateData.value) return null
  return bankUsd.value * bcpRateData.value.usdPygRate
})

const feePercent = (net) => net != null ? ((invoiceUsd.value - net) / invoiceUsd.value * 100).toFixed(2) : null

const usd = (v) => v != null ? v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : '—'
const pyg = (v) => v != null ? `₲ ${Math.round(v).toLocaleString('es-PY')}` : '—'
const withFee = (val, pct) => pct != null ? `${val} (${pct}%)` : val

const tableColumns = computed(() => [
  {
    accessorKey: 'rail',
    header: t('blockchainToFiat.rail'),
    cell: ({ row }) => h('h4', { class: 'text-sm font-semibold' }, row.getValue('rail'))
  },
  { accessorKey: 'usd', header: 'USD' },
  { accessorKey: 'pyg', header: 'PYG' },
  { accessorKey: 'x4t', header: t('blockchainToFiat.x4t') }
])

const tableData = computed(() => [
  { rail: t('blockchainToFiat.bankPy'), usd: withFee(usd(bankUsd.value), feePercent(bankUsd.value)), pyg: withFee(pyg(bankPyg.value), feePercent(bankUsd.value)), x4t: withFee(usd(x4tUsd.value), feePercent(x4tUsd.value)) },
  { rail: t('blockchainToFiat.cash'), usd: withFee(usd(ivanUsd.value), feePercent(ivanUsd.value)), pyg: withFee(pyg(ivanPyg.value), feePercent(ivanUsd.value)), x4t: withFee(usd(x4tUsd.value), feePercent(x4tUsd.value)) }
])
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-10">
    <div>
      <h1 class="text-2xl font-bold">
        {{ t('blockchainToFiat.paraguayTitle') }}
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ t('blockchainToFiat.paraguaySubtitle') }}
      </p>
    </div>

    <section class="space-y-6">
      <h2 class="text-lg font-semibold">
        {{ t('blockchainToFiat.selfCustodial') }}
      </h2>

      <UFormField :label="t('blockchainToFiat.invoiceLabel')">
        <UInput
          v-model.number="invoiceUsd"
          type="number"
          :placeholder="t('blockchainToFiat.invoicePlaceholder')"
        />
      </UFormField>

      <div>
        <h3 class="text-sm font-semibold mb-3">
          {{ t('blockchainToFiat.clientPays') }}
        </h3>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              USDT
            </h4>
            <div class="font-mono font-medium">
              {{ invoiceUsd }}
            </div>
          </div>
          <div>
            <h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              USDC
            </h4>
            <div class="font-mono font-medium">
              {{ invoiceUsd }}
            </div>
          </div>
          <div>
            <h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              BTC
            </h4>
            <div class="font-mono font-medium">
              {{ btcClientAmount }}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-semibold mb-3">
          {{ t('blockchainToFiat.payoutSimulator') }}
        </h3>
        <UTable :columns="tableColumns" :data="tableData" />
      </div>

      <div v-if="pageContent">
        <h3 class="text-sm font-semibold mb-3">
          {{ pageContent.title }}
        </h3>
        <ContentRenderer :value="pageContent" class="prose prose-sm dark:prose-invert max-w-none" />
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold">
        {{ t('blockchainToFiat.custodial') }}
      </h2>
      <p class="text-sm text-gray-400">
        {{ t('blockchainToFiat.comingSoon') }}
      </p>
    </section>
  </div>
</template>
