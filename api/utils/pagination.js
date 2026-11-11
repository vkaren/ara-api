const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePagination(query = {}) {
  const requestedPage = Number.parseInt(query.page, 10);
  const requestedLimit = Number.parseInt(query.limit, 10);

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : DEFAULT_PAGE;
  const limit =
    Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
}

function buildPagination({ page, limit, count }) {
  return {
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit),
  };
}

module.exports = {
  parsePagination,
  buildPagination,
  MAX_LIMIT,
};
