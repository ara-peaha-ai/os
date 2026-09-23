<script setup>
const props = defineProps({
  groups: { type: Array, required: true }
})

// Status (done vs upcoming) is read off the date itself ("Q2/2026"), not the
// group's name, so it works whatever the group is called or translated to.
const today = new Date()
const todayVal = today.getFullYear() * 4 + (Math.floor(today.getMonth() / 3) + 1)
const quarterVal = (dateStr) => {
  const m = dateStr.match(/Q(\d)\D*(\d{4})/)
  return m ? Number(m[2]) * 4 + Number(m[1]) : null
}

// ContentRenderer (not bare MDC/MDCRenderer) is the only one with access to
// the app's Prose* component overrides, so links in a bullet's text resolve correctly.
const { data: timelines } = await useAsyncData(
  `page-timeline-${props.groups.map(g => g.group).join(',')}`,
  async () => {
    const { parseMarkdown } = await import('@nuxtjs/mdc/runtime')
    return Promise.all(props.groups.map(async g => ({
      group: g.group,
      items: await Promise.all(g.items.map(async (it) => {
        const qv = quarterVal(it.date)
        const done = qv !== null && qv <= todayVal
        const { body } = await parseMarkdown(it.description)
        return {
          date: it.date,
          descriptionBody: body,
          icon: done ? 'lucide:check-circle-2' : 'lucide:circle-dashed',
          color: done ? 'success' : 'neutral'
        }
      }))
    })))
  }
)
</script>

<template>
  <div class="space-y-8">
    <section v-for="t in timelines" :key="t.group" class="space-y-3">
      <h2 class="section-title text-xl" style="color: var(--ui-text)">{{ t.group }}</h2>
      <UTimeline :items="t.items">
        <template #description="{ item }">
          <ContentRenderer :value="{ body: item.descriptionBody }" prose />
        </template>
      </UTimeline>
    </section>
  </div>
</template>
