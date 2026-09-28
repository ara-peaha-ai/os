// Content lives under /<locale>/… (content/int/…, content/lat/…), but routes carry the
// locale prefix only with the `prefix` strategy (PR previews). With per-locale domains
// (`no_prefix`, production and the dev sovereign preview) the route has no prefix.
export const useContentRoute = () => {
  const { locale } = useI18n()
  const localePath = useLocalePath()

  const localePrefix = () => `/${locale.value}`
  const hasLocalePrefix = path => path === localePrefix() || path.startsWith(`${localePrefix()}/`)

  // route path -> content path
  const toContentPath = path => hasLocalePrefix(path) ? path : `${localePrefix()}${path === '/' ? '' : path}`

  // content path -> route path for the current i18n strategy
  const toRoutePath = path => localePath((hasLocalePrefix(path) ? path.slice(localePrefix().length) : path) || '/')

  return { toContentPath, toRoutePath }
}
