export const useWiseFetch = () => {
  const { wiseApiToken } = useRuntimeConfig()
  return $fetch.create({
    headers: {
      Authorization: `Bearer ${wiseApiToken}`
    }
  })
}
