// Thin proxy: the CV stays server side (read by Nuxt Content path), the analysis runs in
// ai-cli (`ai ats`, same JSON contract: {cvMarkdown, jobDescription, language} -> report).
// ##todo @giovanni decide how wisdom (Cloudflare Pages) reaches ai-cli on the VPS (bridge, exposure, auth); until then aiCliUrl stays empty todo##
// ##todo @giovanni protect this route (auth or rate limit) before it is linked anywhere public: every call spends LLM credits todo##
export default defineEventHandler(async (event) => {
  const { cvPath, jobDescription, language } = await readBody(event) ?? {}
  if (typeof cvPath !== 'string' || !cvPath.startsWith('/') || cvPath.length > 512
    || typeof jobDescription !== 'string' || !jobDescription.trim() || jobDescription.length > 20000
    || (language !== undefined && typeof language !== 'string'))
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' })

  const { aiCliUrl } = useRuntimeConfig(event)
  if (!aiCliUrl)
    throw createError({ statusCode: 503, statusMessage: 'ai-cli not configured' })

  const page = await getPublishedPage(event, cvPath)
  if (!page?.rawbody)
    throw createError({ statusCode: 404, statusMessage: 'CV not found' })

  return $fetch(`${aiCliUrl}/ats`, {
    method: 'POST',
    body: { cvMarkdown: page.rawbody, jobDescription, language }
  }).catch((error) => {
    console.error('ats-analyze:', error)
    throw createError({ statusCode: 502, statusMessage: 'ATS analysis failed' })
  })
})
