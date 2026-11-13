import type {
  PaginationMeta,
  PaginationQuery,
} from "../types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export function parsePagination(query: PaginationQuery = {}) {
  const requestedPage = Number.parseInt(String(query.page), 10);
  const requestedLimit = Number.parseInt(String(query.limit), 10);

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

export function buildPagination({
  page,
  limit,
  count,
}: {
  page: number;
  limit: number;
  count: number;
}): PaginationMeta {
  return {
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit),
  };
}

