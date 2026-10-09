<script setup>
// Todo command, written `##todo @giovanni @claude #pri 1 !2026-10-20 text todo##`
// (remark-commands.mjs turns it into this component). `to` holds the handles, space-separated; `pri` lower = more urgent;
// `when` is a date or a horizon (short/mid/long). Grammar: the tag-syntax skill.
const props = defineProps({
  to: { type: String, default: '' },
  pri: { type: [Number, String], default: null },
  when: { type: String, default: null },
  // set by remark-commands.mjs when the todo spans several paragraphs
  block: { type: Boolean, default: false }
})

const handles = computed(() => props.to.split(/\s+/).filter(Boolean))
</script>

<template>
  <!-- inline: span root + mdc-unwrap, valid inside a sentence or table cell; block: div keeps the paragraphs -->
  <component
    :is="block ? 'div' : 'span'"
    :class="block ? 'flex flex-wrap items-baseline gap-1.5 my-4' : 'inline-flex flex-wrap items-baseline gap-1.5'"
  >
    <UIcon
      name="i-lucide-square"
      class="self-center shrink-0"
      style="color: var(--ui-text-dimmed)"
    />
    <div
      v-if="block"
      class="[&>p]:my-1"
    >
      <slot />
    </div>
    <span v-else><slot mdc-unwrap="p" /></span>
    <UBadge
      v-for="h in handles"
      :key="h"
      color="neutral"
      variant="subtle"
      size="sm"
    >
      @{{ h }}
    </UBadge>
    <UBadge
      v-if="pri != null"
      color="neutral"
      variant="outline"
      size="sm"
    >
      P{{ pri }}
    </UBadge>
    <UBadge
      v-if="when"
      color="neutral"
      variant="outline"
      size="sm"
      icon="i-lucide-calendar"
    >
      {{ when }}
    </UBadge>
  </component>
</template>
