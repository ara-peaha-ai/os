<script setup>
// ::fee-simulator{code: AR, size: "10_000, 120_000", size_custom_default: 500_000}
// `size` = the two preset example amounts shown as cards; `size_custom_default`
// = starting/max value of the free-input simulator. Underscores are JS numeric-
// literal separators (10_000 = 10000) — plain formatting for a non-dev to write.
const props = defineProps({
  code: { type: String, required: true },
  size: { type: String, default: '' },
  max_custom_amount: { type: [String, Number], default: 1_000_000 }
})

const parseNum = v => Number(String(v).replace(/_/g, '').trim())

const presetAmounts = computed(() => {
  const parts = props.size.split(',').map(parseNum).filter(n => Number.isFinite(n) && n > 0)
  return parts.length === 2 ? parts : null
})

const maxCustomAmount = computed(() => parseNum(props.max_custom_amount) || 500_000)
</script>

<template>
  <SettlementSimulator :country="code" :preset-amounts="presetAmounts" :max-custom-amount="maxCustomAmount" />
</template>
