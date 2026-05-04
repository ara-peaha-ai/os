<script setup>
const props = defineProps({
  endpoint: { type: String, required: true },
  exampleAmounts: {
    type: Object,
    default: () => ({ minimal: 1000, standard: 5000, enhanced: 50000 })
  },
  maxCustomAmount: { type: Number, default: 500000 },
  localCurrency: {
    type: Object,
    default: () => ({ code: 'PYG', symbol: '₲', locale: 'es-PY' })
  }
})

const { t } = useI18n()

const { data: minimalQuote } = useFetch(() => props.endpoint, { query: { amount: props.exampleAmounts.minimal } })
const { data: standardQuote } = useFetch(() => props.endpoint, { query: { amount: props.exampleAmounts.standard } })
const { data: enhancedQuote } = useFetch(() => props.endpoint, { query: { amount: props.exampleAmounts.enhanced } })

const customAmount = ref(props.maxCustomAmount)
watch(customAmount, (val) => {
  if (val > props.maxCustomAmount) customAmount.value = props.maxCustomAmount
  else if (val < 1 || !val) customAmount.value = 1
})
const { data: customQuote } = useFetch(() => props.endpoint, { query: { amount: customAmount } })

const fmtUsd = (v) => v != null ? v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : '—'
const fmtLocal = (v) => v != null ? `${props.localCurrency.symbol} ${Math.round(v).toLocaleString(props.localCurrency.locale)}` : '—'
const fmtFee = (amount, commission) => commission != null && amount ? (commission / amount * 100).toFixed(2) + '%' : '—'
const fmtBtc = (v) => v != null ? v.toFixed(8) : '—'

const aggregate = (channels) => {
  if (!channels) return null
  // cashUsd: Ivan only — Jim settles in PYG cash, not USD
  const cashUsd = channels.cashPickup?.available ? channels.cashPickup : null
  // cashPyg: best of Ivan and Jim by PYG amount
  const cashPygList = ['cashPickup', 'cashCourier'].map(k => channels[k]).filter(c => c?.available && c.pyg != null)
  const cashPyg = cashPygList.reduce((a, b) => a.pyg >= b.pyg ? a : b, cashPygList[0] ?? null)
  const bankList = ['bankWire', 'bankOtc'].map(k => channels[k]).filter(c => c?.available && c.usd != null)
  const bankUsd = bankList.reduce((a, b) => a.usd >= b.usd ? a : b, bankList[0] ?? null)
  return { cashUsd, cashPyg, bankUsd }
}

const levels = computed(() => [
  { key: 'minimal', label: t('blockchainToFiat.levelMinimalLabel'), amount: props.exampleAmounts.minimal, quote: minimalQuote.value },
  { key: 'standard', label: t('blockchainToFiat.levelStandardLabel'), amount: props.exampleAmounts.standard, quote: standardQuote.value },
  { key: 'enhanced', label: t('blockchainToFiat.levelEnhancedLabel'), amount: props.exampleAmounts.enhanced, quote: enhancedQuote.value }
])

const expandedCards = ref({ minimal: false, standard: false, enhanced: false })
const expandedCustom = ref(true)

const customAgg = computed(() => aggregate(customQuote.value?.channels))

const docLevel = computed(() => {
  if (!customQuote.value?.channels) return 'minimal'
  const chs = Object.values(customQuote.value.channels).filter(ch => ch.available !== false)
  if (chs.some(ch => ch.docs === 'enhanced')) return 'enhanced'
  if (chs.some(ch => ch.docs === 'standard')) return 'standard'
  return 'minimal'
})

const extendedRows = (agg, amount) => [
  { label: t('blockchainToFiat.cashPyg'), value: fmtLocal(agg?.cashPyg?.pyg), fee: fmtFee(amount, agg?.cashPyg?.commission) },
  { label: t('blockchainToFiat.cashUsd'), value: fmtUsd(agg?.cashUsd?.usd), fee: fmtFee(amount, agg?.cashUsd?.commission) },
  { label: t('blockchainToFiat.bankPyg'), value: '—', fee: '—' },
  { label: t('blockchainToFiat.bankUsd'), value: fmtUsd(agg?.bankUsd?.usd), fee: fmtFee(amount, agg?.bankUsd?.commission) }
]

const x4tSavings = (quote, agg) => {
  if (!quote?.x4tNetUsd || !agg?.bankUsd?.usd) return null
  const best = Math.max(agg.cashUsd?.usd ?? 0, agg.bankUsd?.usd ?? 0)
  const savings = best - quote.x4tNetUsd
  return savings > 0 ? { savings, x4tNet: quote.x4tNetUsd } : null
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold">{{ t('blockchainToFiat.payoutSimulator') }}</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('blockchainToFiat.payoutSimulatorNote') }}</p>
    </div>

    <!-- 3 fixed example cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="level in levels" :key="level.key" class="rounded-xl border p-5 space-y-4">
        <div class="min-h-16 flex flex-col justify-between">
          <p class="text-base font-semibold leading-snug">{{ level.label }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ t('blockchainToFiat.exampleAmount') }}: {{ fmtUsd(level.amount) }}</p>
        </div>

        <template v-if="!expandedCards[level.key]">
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">{{ t('blockchainToFiat.cashUsd') }}</span>
              <span class="font-mono font-medium">{{ fmtUsd(aggregate(level.quote?.channels)?.cashUsd?.usd) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">{{ t('blockchainToFiat.bankUsd') }}</span>
              <span class="font-mono font-medium">{{ fmtUsd(aggregate(level.quote?.channels)?.bankUsd?.usd) }}</span>
            </div>
          </div>
          <button class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition" @click="expandedCards[level.key] = true">
            {{ t('blockchainToFiat.expand') }} ↓
          </button>
        </template>

        <template v-else>
          <div class="space-y-2 text-xs">
            <div v-for="row in extendedRows(aggregate(level.quote?.channels), level.amount)" :key="row.label" class="flex items-start justify-between gap-2">
              <span class="text-gray-500 shrink-0">{{ row.label }}</span>
              <div class="text-right">
                <p class="font-mono font-medium">{{ row.value }}</p>
                <p class="text-gray-400">{{ row.fee }}</p>
              </div>
            </div>
          </div>
          <div v-if="x4tSavings(level.quote, aggregate(level.quote?.channels))" class="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-2 text-xs">
            <p class="font-medium text-green-700 dark:text-green-300">{{ t('blockchainToFiat.x4tSaves') }}</p>
            <p class="font-mono text-green-600 dark:text-green-400">+{{ fmtUsd(x4tSavings(level.quote, aggregate(level.quote?.channels))?.savings) }}</p>
            <p class="text-gray-400 mt-0.5">{{ t('blockchainToFiat.x4tNet') }}: {{ fmtUsd(x4tSavings(level.quote, aggregate(level.quote?.channels))?.x4tNet) }}</p>
          </div>
          <button class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition" @click="expandedCards[level.key] = false">
            {{ t('blockchainToFiat.collapse') }} ↑
          </button>
        </template>
      </div>
    </div>

    <!-- Custom amount -->
    <div class="rounded-xl border p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">{{ t('blockchainToFiat.customSimulator') }}</h3>
        <button class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition" @click="expandedCustom = !expandedCustom">
          {{ expandedCustom ? `${t('blockchainToFiat.collapse')} ↑` : `${t('blockchainToFiat.expand')} ↓` }}
        </button>
      </div>

      <UFormField :label="t('blockchainToFiat.invoiceLabel')">
        <UInput v-model.number="customAmount" type="number" :min="1" :max="maxCustomAmount" :placeholder="String(maxCustomAmount)" class="w-full" />
      </UFormField>

      <div>
        <p class="text-sm font-medium mb-3">{{ t('blockchainToFiat.clientPays') }}</p>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">USDT</p>
            <p class="font-mono font-medium text-sm">{{ customAmount?.toLocaleString('en-US') ?? '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">USDC</p>
            <p class="font-mono font-medium text-sm">{{ customAmount?.toLocaleString('en-US') ?? '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">BTC</p>
            <p class="font-mono font-medium text-sm">{{ fmtBtc(customQuote?.btcAmount) }}</p>
          </div>
        </div>
      </div>

      <div>
        <p class="text-sm font-medium mb-3">{{ t('blockchainToFiat.sellerReceives') }}</p>

        <template v-if="expandedCustom">
          <div class="space-y-3">
            <div v-for="row in extendedRows(customAgg, customAmount)" :key="row.label" class="rounded-lg border p-4 flex items-start justify-between gap-4">
              <span class="text-sm font-medium">{{ row.label }}</span>
              <div class="text-right">
                <p class="font-mono font-medium text-sm">{{ row.value }}</p>
                <p class="text-xs text-gray-400">{{ row.fee }}</p>
              </div>
            </div>
            <div v-if="x4tSavings(customQuote, customAgg)" class="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 flex items-start justify-between gap-4">
              <span class="text-sm font-medium text-green-700 dark:text-green-300">{{ t('blockchainToFiat.x4tSaves') }}</span>
              <div class="text-right">
                <p class="font-mono font-medium text-sm text-green-600 dark:text-green-400">+{{ fmtUsd(x4tSavings(customQuote, customAgg)?.savings) }}</p>
                <p class="text-xs text-gray-400">{{ t('blockchainToFiat.x4tNet') }}: {{ fmtUsd(x4tSavings(customQuote, customAgg)?.x4tNet) }}</p>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">{{ t('blockchainToFiat.cashUsd') }}</span>
              <span class="font-mono font-medium">{{ fmtUsd(customAgg?.cashUsd?.usd) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">{{ t('blockchainToFiat.bankUsd') }}</span>
              <span class="font-mono font-medium">{{ fmtUsd(customAgg?.bankUsd?.usd) }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Documentation -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">{{ t('blockchainToFiat.documentationTitle') }}</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left border-b border-gray-200 dark:border-gray-700">
              <th class="pb-2 pr-4 font-medium text-gray-700 dark:text-gray-300">{{ t('blockchainToFiat.levelLabel') }}</th>
              <th class="pb-2 pr-4 font-medium text-gray-700 dark:text-gray-300">{{ t('blockchainToFiat.levelUseLabel') }}</th>
              <th class="pb-2 pr-4 font-medium text-gray-700 dark:text-gray-300">{{ t('blockchainToFiat.levelDocsLabel') }}</th>
              <th class="pb-2 font-medium text-gray-700 dark:text-gray-300">{{ t('blockchainToFiat.sofColumn') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr :class="docLevel === 'minimal' ? 'font-semibold' : ''">
              <td class="py-2 pr-4">{{ t('blockchainToFiat.tierMinimal') }}</td>
              <td class="py-2 pr-4 text-gray-500">{{ t('blockchainToFiat.levelMinimalLabel') }}</td>
              <td class="py-2 pr-4 text-gray-500">{{ t('blockchainToFiat.docMinimal') }}</td>
              <td class="py-2 text-gray-500">{{ t('blockchainToFiat.sofMinimal') }}</td>
            </tr>
            <tr :class="docLevel === 'standard' ? 'font-semibold' : ''">
              <td class="py-2 pr-4">{{ t('blockchainToFiat.tierStandard') }}</td>
              <td class="py-2 pr-4 text-gray-500">{{ t('blockchainToFiat.levelStandardLabel') }}</td>
              <td class="py-2 pr-4 text-gray-500">{{ t('blockchainToFiat.docStandard') }}</td>
              <td class="py-2 text-gray-500">{{ t('blockchainToFiat.sofStandard') }}</td>
            </tr>
            <tr :class="docLevel === 'enhanced' ? 'font-semibold' : ''">
              <td class="py-2 pr-4">{{ t('blockchainToFiat.tierEnhanced') }}</td>
              <td class="py-2 pr-4 text-gray-500">{{ t('blockchainToFiat.levelEnhancedLabel') }}</td>
              <td class="py-2 pr-4 text-gray-500">{{ t('blockchainToFiat.docEnhanced') }}</td>
              <td class="py-2 text-gray-500">{{ t('blockchainToFiat.sofEnhanced') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('blockchainToFiat.docStandardNote') }}</p>
    </div>
  </div>
</template>
