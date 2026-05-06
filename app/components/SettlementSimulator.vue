<script setup>
import { countries } from '~/data/countries.js'

const props = defineProps({
  country: { type: String, required: true },
  maxCustomAmount: { type: Number, default: 500_000 }
})

const { t } = useI18n()

const countryData = computed(() => countries.find(c => c.code === props.country))
const localCurrency = computed(() => ({
  code: countryData.value?.currency ?? 'USD',
  symbol: countryData.value?.symbol ?? countryData.value?.currency ?? '$',
  locale: `es-${props.country}`
}))

const EXAMPLE_LEVELS = ['standard', 'enhanced']

const { data: presetQuotes } = useFetch(() => `/api/settlement/${props.country}`)

const customAmount = ref(props.maxCustomAmount)
watch(customAmount, (val) => {
  if (val > props.maxCustomAmount) customAmount.value = props.maxCustomAmount
  else if (!val || val < 1) customAmount.value = 1
})
const { data: customQuote } = useFetch(() => `/api/settlement/${props.country}/${customAmount.value}`)

const fmtUsd = (v) => v != null ? `${Math.round(v).toLocaleString('en-US')} USD` : '—'
const fmtLocal = (v) => v != null ? `${Math.round(v).toLocaleString('en-US')} ${localCurrency.value.code}` : '—'
const fmtBtc = (v) => v != null ? v.toFixed(8) : '—'
const fmtEffectiveRate = (quote, key, amount) => {
  if (!quote?.amount || amount == null) return '—'
  if (isLocalKey(key)) {
    if (!quote.localRate) return '—'
    return ((1 - (amount / quote.localRate) / quote.amount) * 100).toFixed(2) + '%'
  }
  return ((1 - amount / quote.amount) * 100).toFixed(2) + '%'
}

const verificationLabel = (level) => {
  const map = {
    minimal: t('blockchainToFiat.tierMinimal'),
    standard: t('blockchainToFiat.tierStandard'),
    enhanced: t('blockchainToFiat.tierEnhanced')
  }
  return map[level] ? `${map[level]} ${t('blockchainToFiat.verification')}` : ''
}

const isLocalKey = (key) => key.endsWith('Local')

const settlementLabel = (key) => {
  const { code: currency } = localCurrency.value
  return {
    cashUsd: t('blockchainToFiat.cashUsd'),
    cashLocal: t('blockchainToFiat.cashLocal', { currency }),
    bankUsd: t('blockchainToFiat.bankUsd', { code: props.country }),
    bankLocal: t('blockchainToFiat.bankLocal', { code: props.country, currency })
  }[key] ?? key
}

const fmtSettlement = (key, amount) =>
  isLocalKey(key) ? fmtLocal(amount) : fmtUsd(amount)

const visibleSettlements = (settlements) =>
  Object.entries(settlements ?? {}).filter(([, v]) => v !== null)

const usdSettlements = (settlements) =>
  visibleSettlements(settlements).filter(([k]) => !isLocalKey(k))

const localSettlements = (settlements) =>
  visibleSettlements(settlements).filter(([k]) => isLocalKey(k))

const sectionRowLabel = (key) =>
  key.startsWith('bank')
    ? t('blockchainToFiat.bankIn', { code: props.country })
    : t('blockchainToFiat.cash')

const tierLabel = (level) => ({
  minimal: t('blockchainToFiat.tierMinimal'),
  standard: t('blockchainToFiat.tierStandard'),
  enhanced: t('blockchainToFiat.tierEnhanced')
}[level] ?? level)

const docLevel = computed(() => {
  const s = customQuote.value?.settlements
  if (!s) return 'minimal'
  const levels = Object.values(s).filter(Boolean).map(s => s.verification)
  if (levels.includes('enhanced')) return 'enhanced'
  if (levels.includes('standard')) return 'standard'
  return 'minimal'
})

const compareSavings = (quote) => {
  if (!quote?.localCompare?.usd || !quote?.settlements) return null
  const usdAmounts = Object.entries(quote.settlements)
    .filter(([k, v]) => v && !isLocalKey(k))
    .map(([, v]) => v.amount)
  if (!usdAmounts.length) return null
  const bestUsd = Math.max(...usdAmounts)
  const compareUsd = quote.localCompare.usd.amount
  const savings = bestUsd - compareUsd
  if (savings <= 0) return null
  return { savings, compareUsd }
}

const expandedCards = ref({ minimal: false, standard: false, enhanced: false })
const expandedCustom = ref(true)

const levels = computed(() =>
  (presetQuotes.value ?? []).map((quote, i) => ({
    key: EXAMPLE_LEVELS[i],
    label: t(`blockchainToFiat.level${EXAMPLE_LEVELS[i].charAt(0).toUpperCase() + EXAMPLE_LEVELS[i].slice(1)}Label`),
    amount: quote?.amount,
    quote
  }))
)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold">{{ t('blockchainToFiat.payoutSimulator') }}</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('blockchainToFiat.payoutSimulatorNote') }}</p>
    </div>

    <!-- 3 fixed example cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="level in levels" :key="level.key" class="rounded-xl border p-5 flex flex-col gap-4">
        <div class="min-h-16">
          <p class="text-base font-semibold leading-snug">{{ t('blockchainToFiat.exampleAmount') }} {{ fmtUsd(level.amount) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ level.label }}</p>
        </div>

        <template v-if="!expandedCards[level.key]">
          <div class="flex-1 space-y-3 text-sm">
            <div v-if="usdSettlements(level.quote?.settlements).length">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{{ t('blockchainToFiat.merchantReceivesIn', { currency: 'USD' }) }}</p>
              <div class="space-y-1.5">
                <div v-for="[key, s] in usdSettlements(level.quote?.settlements)" :key="key" class="flex items-center justify-between">
                  <span class="text-gray-500">{{ sectionRowLabel(key) }}</span>
                  <span class="font-mono font-medium">{{ fmtUsd(s.amount) }}</span>
                </div>
              </div>
            </div>
            <div v-if="localSettlements(level.quote?.settlements).length">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{{ t('blockchainToFiat.merchantReceivesIn', { currency: localCurrency.code }) }}</p>
              <div class="space-y-1.5">
                <div v-for="[key, s] in localSettlements(level.quote?.settlements)" :key="key" class="flex items-center justify-between">
                  <span class="text-gray-500">{{ sectionRowLabel(key) }}</span>
                  <span class="font-mono font-medium">{{ fmtLocal(s.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
          <button class="mt-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition" @click="expandedCards[level.key] = true">
            {{ t('blockchainToFiat.expand') }} ↓
          </button>
        </template>

        <template v-else>
          <div class="flex-1 space-y-3 text-xs">
            <div v-if="usdSettlements(level.quote?.settlements).length">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{{ t('blockchainToFiat.merchantReceivesIn', { currency: 'USD' }) }}</p>
              <div class="space-y-2">
                <div v-for="[key, s] in usdSettlements(level.quote?.settlements)" :key="key" class="space-y-0.5">
                  <div class="flex justify-between">
                    <span class="text-gray-500">{{ sectionRowLabel(key) }}</span>
                    <span class="font-mono font-medium">{{ fmtUsd(s.amount) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-400">
                    <span>{{ t('blockchainToFiat.fee') }}</span>
                    <span>{{ fmtEffectiveRate(level.quote, key, s.amount) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-400">
                    <span class="capitalize">{{ t('blockchainToFiat.verification') }}</span>
                    <span>{{ tierLabel(s.verification) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="localSettlements(level.quote?.settlements).length">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{{ t('blockchainToFiat.merchantReceivesIn', { currency: localCurrency.code }) }}</p>
              <div class="space-y-2">
                <div v-for="[key, s] in localSettlements(level.quote?.settlements)" :key="key" class="space-y-0.5">
                  <div class="flex justify-between">
                    <span class="text-gray-500">{{ sectionRowLabel(key) }}</span>
                    <span class="font-mono font-medium">{{ fmtLocal(s.amount) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-400">
                    <span>{{ t('blockchainToFiat.fee') }}</span>
                    <span>{{ fmtEffectiveRate(level.quote, key, s.amount) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-400">
                    <span class="capitalize">{{ t('blockchainToFiat.verification') }}</span>
                    <span>{{ tierLabel(s.verification) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-auto space-y-4">
            <div v-if="compareSavings(level.quote)" class="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-2 text-xs">
              <p class="font-medium text-green-700 dark:text-green-300">{{ t('blockchainToFiat.x4tSaves') }} {{ fmtUsd(compareSavings(level.quote)?.savings) }}</p>
              <p class="text-gray-400 mt-0.5">{{ t('blockchainToFiat.x4tNet') }}: {{ fmtUsd(compareSavings(level.quote).compareUsd) }}</p>
              <p class="text-gray-400 mt-0.5">{{ verificationLabel(level.quote?.localCompare?.usd?.verification) }}</p>
            </div>
            <button class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition" @click="expandedCards[level.key] = false">
              {{ t('blockchainToFiat.collapse') }} ↑
            </button>
          </div>
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

      <div class="space-y-4">
        <div v-if="usdSettlements(customQuote?.settlements).length">
          <p class="text-sm font-medium mb-3">{{ t('blockchainToFiat.merchantReceivesIn', { currency: 'USD' }) }}</p>
          <template v-if="expandedCustom">
            <div class="space-y-3">
              <div v-for="[key, s] in usdSettlements(customQuote?.settlements)" :key="key" class="rounded-lg border p-4 space-y-0.5">
                <div class="flex justify-between">
                  <span class="text-sm font-medium">{{ sectionRowLabel(key) }}</span>
                  <span class="font-mono font-medium text-sm">{{ fmtUsd(s.amount) }}</span>
                </div>
                <div class="flex justify-between text-xs text-gray-400">
                  <span>{{ t('blockchainToFiat.fee') }}</span>
                  <span>{{ fmtEffectiveRate(customQuote, key, s.amount) }}</span>
                </div>
                <div class="flex justify-between text-xs text-gray-400">
                  <span class="capitalize">{{ t('blockchainToFiat.verification') }}</span>
                  <span>{{ tierLabel(s.verification) }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="space-y-2 text-sm">
              <div v-for="[key, s] in usdSettlements(customQuote?.settlements)" :key="key" class="flex items-center justify-between">
                <span class="text-gray-500">{{ sectionRowLabel(key) }}</span>
                <span class="font-mono font-medium">{{ fmtUsd(s.amount) }}</span>
              </div>
            </div>
          </template>
        </div>

        <div v-if="localSettlements(customQuote?.settlements).length">
          <p class="text-sm font-medium mb-3">{{ t('blockchainToFiat.merchantReceivesIn', { currency: localCurrency.code }) }}</p>
          <template v-if="expandedCustom">
            <div class="space-y-3">
              <div v-for="[key, s] in localSettlements(customQuote?.settlements)" :key="key" class="rounded-lg border p-4 space-y-0.5">
                <div class="flex justify-between">
                  <span class="text-sm font-medium">{{ sectionRowLabel(key) }}</span>
                  <span class="font-mono font-medium text-sm">{{ fmtLocal(s.amount) }}</span>
                </div>
                <div class="flex justify-between text-xs text-gray-400">
                  <span>{{ t('blockchainToFiat.fee') }}</span>
                  <span>{{ fmtEffectiveRate(customQuote, key, s.amount) }}</span>
                </div>
                <div class="flex justify-between text-xs text-gray-400">
                  <span class="capitalize">{{ t('blockchainToFiat.verification') }}</span>
                  <span>{{ tierLabel(s.verification) }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="space-y-2 text-sm">
              <div v-for="[key, s] in localSettlements(customQuote?.settlements)" :key="key" class="flex items-center justify-between">
                <span class="text-gray-500">{{ sectionRowLabel(key) }}</span>
                <span class="font-mono font-medium">{{ fmtLocal(s.amount) }}</span>
              </div>
            </div>
          </template>
        </div>

        <div v-if="compareSavings(customQuote)" class="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 text-sm">
          <p class="font-medium text-green-700 dark:text-green-300">{{ t('blockchainToFiat.x4tSaves') }} {{ fmtUsd(compareSavings(customQuote)?.savings) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ t('blockchainToFiat.x4tNet') }}: {{ fmtUsd(compareSavings(customQuote).compareUsd) }}</p>
          <p class="text-xs text-gray-400">{{ verificationLabel(customQuote?.localCompare?.usd?.verification) }}</p>
        </div>
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
              <th class="pb-2 pr-4 font-medium text-gray-700 dark:text-gray-300">{{ t('blockchainToFiat.levelDocsLabel') }}</th>
              <th class="pb-2 font-medium text-gray-700 dark:text-gray-300">{{ t('blockchainToFiat.sofColumn') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr :class="docLevel === 'minimal' ? 'font-semibold' : ''">
              <td class="py-2 pr-4">{{ t('blockchainToFiat.tierMinimal') }}</td>
              <td class="py-2 pr-4 text-gray-500">{{ t('blockchainToFiat.docMinimal') }}</td>
              <td class="py-2 text-gray-500">{{ t('blockchainToFiat.sofMinimal') }}</td>
            </tr>
            <tr :class="docLevel === 'standard' ? 'font-semibold' : ''">
              <td class="py-2 pr-4">{{ t('blockchainToFiat.tierStandard') }}</td>
              <td class="py-2 pr-4 text-gray-500">{{ t('blockchainToFiat.docStandard') }}</td>
              <td class="py-2 text-gray-500">{{ t('blockchainToFiat.sofStandard') }}</td>
            </tr>
            <tr :class="docLevel === 'enhanced' ? 'font-semibold' : ''">
              <td class="py-2 pr-4">{{ t('blockchainToFiat.tierEnhanced') }}</td>
              <td class="py-2 pr-4 text-gray-500">{{ t('blockchainToFiat.docEnhanced') }}</td>
              <td class="py-2 text-gray-500">{{ t('blockchainToFiat.sofEnhanced') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
