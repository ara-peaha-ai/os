export const useAtsScanner = () => {
  const { localeProperties } = useI18n()
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const analyzeCv = async (cvPath, jobDescription) => {
    loading.value = true
    error.value = null
    try {
      data.value = await $fetch('/api/cv/ats-analyze', {
        method: 'POST',
        body: { cvPath, jobDescription, language: localeProperties.value.language }
      })
    } catch (e) {
      data.value = null
      error.value = e.data?.statusMessage || e.message
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, analyzeCv }
}
