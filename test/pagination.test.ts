const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parsePagination,
  buildPagination,
  MAX_LIMIT,
} = require("../api/utils/pagination");

test("uses default pagination values", () => {
  assert.deepEqual(parsePagination(), parsePagination({ page: "invalid", limit: "invalid" }));
});

test("calculates the offset and caps the maximum page size", () => {
  assert.deepEqual(parsePagination({ page: "3", limit: "200" }), {
    page: 3,
    limit: MAX_LIMIT,
    offset: (3 - 1) * MAX_LIMIT,
  });
});

test("falls back for invalid values", () => {
  assert.deepEqual(parsePagination({ page: "0", limit: "-2" }), {
    page: 1,
    limit: parsePagination().limit,
    offset: 0,
  });
});

test("builds pagination metadata", () => {
  assert.deepEqual(buildPagination({ page: 2, limit: 10, count: 25 }), {
    page: 2,
    limit: 10,
    total: 25,
    totalPages: 3,
  });
});
