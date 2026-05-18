<script setup>
const route = useRoute()
const { data } = await useAsyncData(`service-${route.path}`, () =>
  useContentQuery().where('path', 'LIKE', `%${route.path}`).first()
)
</script>

<template>
  <ServicePage :content="data" />
</template>
