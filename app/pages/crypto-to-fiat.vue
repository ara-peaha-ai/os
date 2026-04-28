<script setup>
const mainSource = ref('USDT')
const amount = ref(1000)

const isStablecoin = computed(() => ['USDT', 'USDC'].includes(mainSource.value))

const { data: krakenExchangeRate } = await useFetch('/api/kraken/rates', {
  query: computed(() => ({ source: mainSource.value, target: 'EUR' }))
})

const { data: krakenBtcUsdRate } = await useFetch('/api/kraken/rates', {
  query: { source: 'BTC', target: 'USD' }
})

const invoiceUsd = computed(() => {
  if (isStablecoin.value) return amount.value
  if (krakenBtcUsdRate.value) return amount.value * krakenBtcUsdRate.value.priceAfterFee
  return null
})

const { data: wiseExchangeRate } = await useFetch('/api/wise/retes', {
  query: computed(() => ({ source: 'EUR', target: 'USD', amount: amount.value, country: 'PY' }))
})

const { data: p2pagosQuote } = await useFetch('/api/p2pagos/quote', {
  query: computed(() => ({ amount: invoiceUsd.value, currency: 'USD' }))
})
</script>

<template>
  <div></div>
</template>
