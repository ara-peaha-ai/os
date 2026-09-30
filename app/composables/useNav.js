// The homepage frontmatter `nav` is the single list behind the navbar and the
// homepage boxes that point at it (::content-boxes with `nav: <group>`).
// Each group is either a folder (string: every page under it) or a custom list
// of paths (array) — the same shape as ::content-boxes `paths`.
// ponytail: flat groups only; nested groups (hierarchical menu) come with the
// customizable navbar, keeping this shape as the leaf level.
export const useNav = async () => {
  const { locale } = useI18n()
  const { data } = await useAsyncData(`nav-${locale.value}`, () =>
    queryCollection('content').where('path', '=', `/${locale.value}`).select('nav').first()
  )
  return computed(() => data.value?.nav ?? {})
}
