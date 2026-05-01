<script setup>
const route = useRoute()
const { data } = await useAsyncData(`service-${route.path}`, () =>
  queryCollection('content').where('path', 'LIKE', `%${route.path}`).first()
)
</script>

<template>
  <ServicePage :content="data" />
</template>
