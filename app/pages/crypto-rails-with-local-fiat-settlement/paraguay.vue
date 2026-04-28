<script setup>
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

const ivanUsd = computed(() => invoiceUsd.value * 0.98)
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
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-10">
    <section class="space-y-6">
      <h2 class="text-lg font-semibold">
        {{ t('cryptoToFiat.selfCustodial') }}
      </h2>

      <UFormField :label="t('cryptoToFiat.invoiceLabel')">
        <UInput
          v-model.number="invoiceUsd"
          type="number"
          :placeholder="t('cryptoToFiat.invoicePlaceholder')"
        />
      </UFormField>

      <div>
        <p class="text-xs text-gray-500 mb-2">
          {{ t('cryptoToFiat.clientPays') }}
        </p>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-xs text-gray-400">
              USDT
            </div>
            <div class="font-mono font-medium">
              {{ invoiceUsd }}
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-400">
              USDC
            </div>
            <div class="font-mono font-medium">
              {{ invoiceUsd }}
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-400">
              BTC
            </div>
            <div class="font-mono font-medium">
              {{ btcClientAmount }}
            </div>
          </div>
        </div>
      </div>

      <div>
        <p class="text-xs text-gray-500 mb-2">
          {{ t('cryptoToFiat.priceSimulator') }}
        </p>
        <UTable
          :columns="[
            { accessorKey: 'rail', header: t('cryptoToFiat.rail') },
            { accessorKey: 'usd', header: 'USD' },
            { accessorKey: 'pyg', header: 'PYG' },
            { accessorKey: 'x4t', header: t('cryptoToFiat.x4t') }
          ]"
          :data="[
            { rail: t('cryptoToFiat.cash'), usd: withFee(usd(ivanUsd), feePercent(ivanUsd)), pyg: withFee(pyg(ivanPyg), feePercent(ivanUsd)), x4t: withFee(usd(x4tUsd), feePercent(x4tUsd)) },
            { rail: t('cryptoToFiat.bankPy'), usd: withFee(usd(bankUsd), feePercent(bankUsd)), pyg: withFee(pyg(bankPyg), feePercent(bankUsd)), x4t: withFee(usd(x4tUsd), feePercent(x4tUsd)) }
          ]"
        />
      </div>

      <div v-if="pageContent">
        <p class="text-xs text-gray-500 mb-2">
          {{ pageContent.title }}
        </p>
        <ContentRenderer :value="pageContent" class="prose prose-sm dark:prose-invert max-w-none" />
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold">
        {{ t('cryptoToFiat.custodial') }}
      </h2>
      <p class="text-sm text-gray-400">
        {{ t('cryptoToFiat.comingSoon') }}
      </p>
    </section>
  </div>
</template>
