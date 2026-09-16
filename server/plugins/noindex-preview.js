// Preview deployments (PR previews, local dev with NUXT_PUBLIC_IS_PREVIEW=true)
// have no per-locale domain and no robots.txt of their own — without this,
// every open PR is a fully public, fully crawlable duplicate of the real site.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    if (isPreviewMode(event))
      setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  })
})
