// Thin proxy: the CV stays server side (read by Nuxt Content path), the analysis runs in
// ai-cli (`ai ats` behind ai-bridge, same JSON contract: {cvMarkdown, jobDescription, language} -> report).
// ##todo @giovanni protect this route (auth or rate limit) before it is linked anywhere public: every call spends LLM credits todo##
export default defineEventHandler(async (event) => {
  const { cvPath, jobDescription, language } = await readBody(event) ?? {}
  if (typeof cvPath !== 'string' || !cvPath.startsWith('/') || cvPath.length > 512
    || typeof jobDescription !== 'string' || !jobDescription.trim() || jobDescription.length > 20000
    || (language !== undefined && (typeof language !== 'string' || language.length > 35)))
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' })

  const { aiCliUrl, aiCliToken } = useRuntimeConfig(event)
  if (!aiCliUrl || !aiCliToken)
    throw createError({ statusCode: 503, statusMessage: 'ai-cli not configured' })

  const page = await getPublishedPage(event, cvPath)
  if (!page?.rawbody)
    throw createError({ statusCode: 404, statusMessage: 'CV not found' })

  return $fetch(`${aiCliUrl.replace(/\/$/, '')}/ats`, {
    method: 'POST',
    headers: { authorization: `Bearer ${aiCliToken}` },
    // rawbody is the source file: the frontmatter is metadata, not CV text
    body: { cvMarkdown: page.rawbody.replace(/^---\n[\s\S]*?\n---\n?/, ''), jobDescription, language }
  }).catch((error) => {
    console.error('ats-analyze:', error)
    throw createError({ statusCode: 502, statusMessage: 'ATS analysis failed' })
  })
})
