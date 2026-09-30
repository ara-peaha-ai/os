// Tags outbound links with utm_source so the sites we link to see the traffic
// as ours. The value comes from the package.json scope (runtimeConfig.public.utmSource).
// Own domains (every subdomain of the current site), mailto:/tel: and links that
// already carry a utm_source are left as they are.
export const withUtm = (href) => {
  if (!href || !/^https?:\/\//.test(href)) return href
  const { public: { utmSource } } = useRuntimeConfig()
  const url = new URL(href)
  const ownDomain = useRequestURL().hostname.split('.').slice(-2).join('.')
  if (!utmSource || url.hostname.endsWith(ownDomain) || url.searchParams.has('utm_source')) return href
  url.searchParams.set('utm_source', utmSource)
  return url.toString()
}
