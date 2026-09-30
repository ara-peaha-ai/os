// Tags outbound links with utm_source so the sites we link to see the traffic
// as ours. The value comes from the package.json scope (runtimeConfig.public.utmSource).
// Left as they are: this site (the current host and the locale domains, and their
// subdomains), mailto:/tel:, URLs that don't parse, URLs with credentials and links
// that already carry a utm_source. The parameter is appended to the authored string,
// so the rest of the URL (encoding, trailing slash, case) is not rewritten.
export const withUtm = (href) => {
  if (!href || !/^https?:\/\//.test(href)) return href
  const { public: { utmSource, ownHosts = [] } } = useRuntimeConfig()
  let url
  try {
    url = new URL(href)
  } catch {
    return href
  }
  const isOwn = [useRequestURL().hostname, ...ownHosts].some(h => url.hostname === h || url.hostname.endsWith(`.${h}`))
  if (!utmSource || isOwn || url.username || url.password || url.searchParams.has('utm_source')) return href
  const hashAt = href.indexOf('#')
  const base = hashAt < 0 ? href : href.slice(0, hashAt)
  const hash = hashAt < 0 ? '' : href.slice(hashAt)
  return `${base}${base.includes('?') ? '&' : '?'}utm_source=${encodeURIComponent(utmSource)}${hash}`
}
