<script setup>
const { t } = useI18n()
const { data, error, loading, analyzeCv } = useAtsScanner()

const cvPath = ref('')
const jobDescription = ref('')

const statusColor = { excellent: 'success', good: 'warning', poor: 'error' }

const sections = computed(() => [
  { key: 'missingHardSkills', items: data.value?.missingHardSkills },
  { key: 'missingSoftSkills', items: data.value?.missingSoftSkills },
  { key: 'keywordDensityIssues', items: data.value?.keywordDensityIssues },
  { key: 'formattingSuggestionsForPdf', items: data.value?.formattingSuggestionsForPdf }
])
</script>

<template>
  <div class="space-y-8">
    <form
      class="grid gap-6 md:grid-cols-2"
      @submit.prevent="analyzeCv(cvPath, jobDescription)"
    >
      <UFormField
        :label="t('ats.cvPath')"
        :help="t('ats.cvPathHelp')"
        required
      >
        <UInput
          v-model="cvPath"
          placeholder="/original/doc/cv"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="t('ats.jobDescription')"
        required
        class="md:row-span-2"
      >
        <UTextarea
          v-model="jobDescription"
          :rows="12"
          autoresize
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        :loading="loading"
        :disabled="!cvPath || !jobDescription.trim()"
        :label="loading ? t('ats.analyzing') : t('ats.analyze')"
        class="self-start"
      />
    </form>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="t('ats.error')"
      :description="error"
    />

    <UCard v-if="data">
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold">
            {{ t('ats.report') }}
          </h2>
          <UBadge
            :color="statusColor[data.matchStatus]"
            :label="t(`ats.status.${data.matchStatus}`)"
            size="lg"
          />
        </div>
      </template>

      <div class="space-y-6">
        <div>
          <div class="mb-2 flex items-baseline justify-between">
            <span class="text-sm text-muted">{{ t('ats.score') }}</span>
            <span class="text-3xl font-bold">{{ data.score }}/100</span>
          </div>
          <UProgress
            :model-value="data.score"
            :color="statusColor[data.matchStatus]"
          />
        </div>

        <section
          v-for="section in sections"
          :key="section.key"
        >
          <h3 class="mb-2 font-medium">
            {{ t(`ats.${section.key}`) }}
          </h3>
          <ul
            v-if="section.items?.length"
            class="list-disc space-y-1 ps-5 text-sm"
          >
            <li
              v-for="item in section.items"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
          <p
            v-else
            class="text-sm text-muted"
          >
            {{ t('ats.none') }}
          </p>
        </section>
      </div>
    </UCard>
  </div>
</template>
