<script setup>
defineProps({
  to: { type: String, default: null },
  href: { type: String, default: null },
  image: { type: String, default: null },
  imageAlt: { type: String, default: '' },
  badge: { type: String, default: null },
  title: { type: String, required: true },
  description: { type: String, default: null }
})
</script>

<template>
  <component
    :is="to ? 'NuxtLink' : href ? 'a' : 'div'"
    v-bind="to ? { to } : href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {}"
    class="app-card-guide"
  >
    <div v-if="image" class="app-card-guide__img-wrap">
      <img :src="image" :alt="imageAlt" class="app-card-guide__img" />
      <span v-if="badge" class="app-card-guide__badge">{{ badge }}</span>
    </div>
    <div class="app-card-guide__body">
      <p class="app-card-guide__title">{{ title }}</p>
      <p v-if="description" class="app-card-guide__desc">{{ description }}</p>
    </div>
  </component>
</template>

<style scoped>
.app-card-guide {
  display: block;
  border: 1px solid var(--ui-border);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: border-color 0.15s;
  text-decoration: none;
  color: inherit;
}

.app-card-guide:hover {
  border-color: var(--ui-primary);
}

.app-card-guide__img-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  background-color: var(--ui-bg-muted);
  overflow: hidden;
}

.app-card-guide__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.app-card-guide__badge {
  position: absolute;
  top: 0.625rem;
  left: 0.625rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background-color: var(--ui-bg);
  color: var(--ui-text-muted);
  border: 1px solid var(--ui-border);
  border-radius: 0.25rem;
  padding: 0.125rem 0.4rem;
}

.app-card-guide__body {
  padding: 1rem 1.25rem 1.25rem;
}

.app-card-guide__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ui-primary);
  line-height: 1.45;
}

.app-card-guide__desc {
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  color: var(--ui-text-muted);
  line-height: 1.6;
}
</style>
