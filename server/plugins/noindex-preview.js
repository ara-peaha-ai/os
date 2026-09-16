// Preview deployments (PR previews, local dev with NUXT_PUBLIC_IS_PREVIEW=true)
// have no per-locale domain and no robots.txt of their own — without this,
// every open PR is a fully public, fully crawlable duplicate of the real site.
//
// no-store also matters once a PR merges: Cloudflare Pages branch aliases
// (pr-N.project.pages.dev) don't always drop a deleted deployment cleanly
// across every edge PoP right away, and anything cached from before deletion
// would otherwise keep serving stale/broken responses during that window.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    if (isPreviewMode(event)) {
      setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
      setResponseHeader(event, 'Cache-Control', 'no-store')
    }
  })
})
