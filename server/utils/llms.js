// Single source of truth for locale codes/domains: @nuxtjs/i18n publishes its
// resolved `nuxt.config.js` locales (code + domain) here at runtime — nothing
// about locales is hardcoded, so adding/renaming a locale in nuxt.config.js
// needs no change in this file.
const getI18n = event => useRuntimeConfig(event).public.i18n

// ponytail: these routes are plain Nitro routes, never touched by nuxt-i18n's
// page routing, so they have no locale prefix/domain-match of their own to
// read. Host covers production (differentDomains, the only shape that's real
// there); the /:locale/ alias and ?locale= are local/preview-only conveniences
// where every locale shares one origin — production never needs either.
export const getLocaleFromEvent = (event) => {
  const i18n = getI18n(event)
  const host = getRequestHost(event, { xForwardedHost: true })
  const hostLocale = Object.entries(i18n.domainLocales).find(([, v]) => v.domain === host)?.[0]
  if (hostLocale) return hostLocale
  const routeLocale = getRouterParam(event, 'locale')
  if (routeLocale && Object.hasOwn(i18n.domainLocales, routeLocale)) return routeLocale
  const queryLocale = getQuery(event).locale
  if (Object.hasOwn(i18n.domainLocales, queryLocale)) return queryLocale
  return i18n.defaultLocale
}

// Both conditions below are ANDed at the top level (one entry per top-level
// `.where`/`.orWhere` call, joined with " AND " by the query builder) — the
// `.where().where()` pair inside the group is what turns OR, because that
// group was attached via `.orWhere(...)`, not because of how it's written
// internally. Net predicate: (path match) AND (draft IS NULL OR draft != true).
// Do not "simplify" this without re-reading collectionQueryBuilder's source.
export const getPublishedPages = (event, locale) =>
  queryCollection(event, 'content')
    .where('path', 'LIKE', `/${locale}%`)
    .orWhere(group => group.where('draft', 'IS NULL').where('draft', '!=', true))
    .select('path', 'title', 'description', 'rawbody')
    .order('path', 'ASC')
    .all()

export const getPublishedPage = (event, path) =>
  queryCollection(event, 'content')
    .where('path', '=', path)
    .orWhere(group => group.where('draft', 'IS NULL').where('draft', '!=', true))
    .select('rawbody')
    .first()

export const stripLocale = (path, locale) => path.replace(`/${locale}`, '') || '/'

// Preview has no per-locale domain (nuxt.config.js only sets `domain` when
// NUXT_PUBLIC_IS_PREVIEW !== 'true' at build time), so this is baked into the
// build output — safe to read here even on Cloudflare Workers, unlike a
// runtime process.env lookup, which isn't guaranteed to see build-time vars.
const isPreviewMode = event =>
  Object.values(getI18n(event).domainLocales).every(v => !v.domain)

// ponytail: in production (no_prefix + differentDomains) the domain carries
// the locale, so the path is bare; in preview (`prefix`, one shared origin)
// every locale keeps its prefix — mirrors nuxt.config.js's `strategy` pair.
export const toPublicPath = (event, path, locale) => {
  const bare = stripLocale(path, locale)
  if (!isPreviewMode(event)) return bare
  return bare === '/' ? `/${locale}` : `/${locale}${bare}`
}

export const toRawHref = (event, path, locale) => {
  const bare = stripLocale(path, locale)
  const raw = bare === '/' ? '/raw/index.md' : `/raw${bare}.md`
  return isPreviewMode(event) ? `/${locale}${raw}` : raw
}

// Shared handlers so the real (bare, production) route and the local-only
// /:locale/ alias serve identical logic — see server/routes/[locale]/.
export const buildLlmsTxt = async (event) => {
  const locale = getLocaleFromEvent(event)
  const origin = getRequestURL(event).origin
  const pages = await getPublishedPages(event, locale)

  const lines = [
    '# PE\'AHA',
    '> Multi-rail payment infrastructure for LATAM. Every page below is also available as clean markdown at the linked .md URL.',
    '',
    '## Pages'
  ]
  for (const page of pages) {
    const href = origin + toRawHref(event, page.path, locale)
    lines.push(
      page.description
        ? `- [${page.title}](${href}): ${page.description}`
        : `- [${page.title}](${href})`
    )
  }

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return lines.join('\n')
}

export const buildLlmsFullTxt = async (event) => {
  const locale = getLocaleFromEvent(event)
  const origin = getRequestURL(event).origin
  const pages = await getPublishedPages(event, locale)

  const parts = pages.map((page) => {
    const url = origin + toPublicPath(event, page.path, locale)
    return `<!-- ${url} -->\n\n${page.rawbody || ''}`
  })

  setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  return parts.join('\n\n---\n\n')
}

export const serveRawMarkdown = async (event) => {
  const raw = getRouterParams(event)['slug.md']
  if (!raw?.endsWith('.md'))
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })

  const locale = getLocaleFromEvent(event)
  let path = '/' + raw.slice(0, -3)
  if (path === '/index') path = ''

  const page = await getPublishedPage(event, `/${locale}${path}`)
  if (!page)
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })

  setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  return page.rawbody || ''
}
