<script setup>
definePageMeta({ name: 'styleguide' })

useSeoMeta({ title: 'Styleguide — Bennet Design System' })
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-16">

    <section class="space-y-2">
      <AppSectionLabel label="Design System" />
      <h1 class="text-3xl font-bold" style="color: var(--ui-text)">Bennet Design System</h1>
      <p style="color: var(--ui-text-muted)">Tokens, primitive e scale tipografiche. Verifica in light e dark mode.</p>
    </section>

    <AppSeparator />

    <!-- COLOR TOKENS -->
    <section class="space-y-6">
      <h2 class="section-title">Color tokens</h2>

      <div class="space-y-3">
        <p class="text-xs uppercase tracking-widest" style="color: var(--ui-text-dimmed)">Background</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="t in ['--ui-bg','--ui-bg-muted','--ui-bg-elevated','--ui-bg-accented']" :key="t" class="space-y-1">
            <div class="h-12 rounded border" :style="`background-color: var(${t}); border-color: var(--ui-border-accented)`" />
            <p class="text-xs break-all" style="color: var(--ui-text-dimmed)">{{ t }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <p class="text-xs uppercase tracking-widest" style="color: var(--ui-text-dimmed)">Text</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="t in ['--ui-text','--ui-text-tinted','--ui-text-muted','--ui-text-dimmed']" :key="t" class="space-y-1">
            <div class="h-12 rounded border flex items-center justify-center text-sm font-medium" :style="`color: var(${t}); border-color: var(--ui-border)`">Aa</div>
            <p class="text-xs break-all" style="color: var(--ui-text-dimmed)">{{ t }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <p class="text-xs uppercase tracking-widest" style="color: var(--ui-text-dimmed)">Border</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div v-for="t in ['--ui-border','--ui-border-muted','--ui-border-accented']" :key="t" class="space-y-1">
            <div class="h-12 rounded border-2" :style="`border-color: var(${t})`" />
            <p class="text-xs break-all" style="color: var(--ui-text-dimmed)">{{ t }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <p class="text-xs uppercase tracking-widest" style="color: var(--ui-text-dimmed)">Primary</p>
        <div class="flex gap-3 flex-wrap">
          <div
            v-for="shade in [50,100,200,300,400,500,600,700,800,900,950]"
            :key="shade"
            class="space-y-1"
          >
            <div class="h-10 w-10 rounded" :class="`bg-blue-${shade}`" />
            <p class="text-xs text-center" style="color: var(--ui-text-dimmed)">{{ shade }}</p>
          </div>
        </div>
      </div>
    </section>

    <AppSeparator />

    <!-- TYPOGRAPHY -->
    <section class="space-y-6">
      <h2 class="section-title">Typography scale</h2>
      <div class="space-y-4">
        <div v-for="item in [
          { cls: 'text-3xl font-bold', label: 'text-3xl bold — H1' },
          { cls: 'text-2xl font-bold', label: 'text-2xl bold — H2' },
          { cls: 'text-xl font-semibold', label: 'text-xl semibold — H3' },
          { cls: 'text-lg', label: 'text-lg — Lead' },
          { cls: 'text-base', label: 'text-base — Body' },
          { cls: 'text-sm', label: 'text-sm — Small' },
          { cls: 'text-xs uppercase tracking-widest font-semibold', label: 'text-xs upper — Label' },
        ]" :key="item.label" class="flex items-baseline gap-4">
          <span class="w-52 text-xs shrink-0" style="color: var(--ui-text-dimmed)">{{ item.label }}</span>
          <span :class="item.cls" style="color: var(--ui-text)">P2Pagos payment infra</span>
        </div>
      </div>
    </section>

    <AppSeparator />

    <!-- PRIMITIVES -->
    <section class="space-y-10">
      <h2 class="section-title">Primitives</h2>

      <!-- AppSectionLabel -->
      <div class="space-y-2">
        <p class="text-xs" style="color: var(--ui-text-dimmed)">AppSectionLabel</p>
        <AppSectionLabel label="Products & Services" />
      </div>

      <!-- AppSeparator -->
      <div class="space-y-2">
        <p class="text-xs" style="color: var(--ui-text-dimmed)">AppSeparator</p>
        <AppSeparator />
      </div>

      <!-- link-accent -->
      <div class="space-y-2">
        <p class="text-xs" style="color: var(--ui-text-dimmed)">.link-accent</p>
        <a href="#" class="link-accent text-sm">Visit documentation →</a>
      </div>

      <!-- section-title -->
      <div class="space-y-2">
        <p class="text-xs" style="color: var(--ui-text-dimmed)">.section-title</p>
        <p class="section-title">Section heading in mono bold</p>
      </div>

      <!-- AppCardGuide — without image -->
      <div class="space-y-2">
        <p class="text-xs" style="color: var(--ui-text-dimmed)">AppCardGuide (no image)</p>
        <div class="grid sm:grid-cols-2 gap-4">
          <AppCardGuide
            badge="EXPLAINER"
            title="How Local2Coin works in Paraguay"
            description="A step-by-step look at how fiat liquidity is sourced and settled across rails."
            to="#"
          />
          <AppCardGuide
            badge="TUTORIAL"
            title="Integrating the P2Pagos API"
            description="Authenticate, create a quote, and confirm a transfer in under 30 lines."
            to="#"
          />
        </div>
      </div>
    </section>

    <AppSeparator />

    <!-- NUXT UI COMPONENTS -->
    <section class="space-y-6">
      <h2 class="section-title">Nuxt UI components (token check)</h2>

      <div class="flex flex-wrap gap-3">
        <UBadge color="primary" variant="solid">solid</UBadge>
        <UBadge color="primary" variant="subtle">subtle</UBadge>
        <UBadge color="primary" variant="soft">soft</UBadge>
        <UBadge color="neutral" variant="subtle">neutral</UBadge>
      </div>

      <div class="flex flex-wrap gap-3">
        <UButton color="primary" variant="solid">Primary</UButton>
        <UButton color="primary" variant="outline">Outline</UButton>
        <UButton color="neutral" variant="ghost">Ghost</UButton>
      </div>
    </section>

  </div>
</template>
