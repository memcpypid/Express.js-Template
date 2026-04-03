/**
 * Utility to generate pagination parameters from request query.
 * Equivalent to the provided Go logic.
 */
export const generatePagination = (query) => {
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const sort = query.sort === 'asc' || query.sort === 'desc' ? query.sort : 'desc';
  const sortBy = query.sort_by || 'created_at';
  const search = query.search || '';
  const offset = (page - 1) * limit;

  return { limit, page, sort, sortBy, search, offset };
};
