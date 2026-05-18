export const useContentQuery = () =>
  queryCollection('content').orWhere(group =>
    group.where('draft', 'IS NULL').where('draft', '!=', true)
  )
