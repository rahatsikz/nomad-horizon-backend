import { describe, expect, it } from "vitest";
import { paginationHelpers } from "../../src/helpers/paginationHelpers";

describe("paginationHelpers.calculatePagination", () => {
  it("uses safe defaults when no options are provided", () => {
    expect(paginationHelpers.calculatePagination({})).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
      sortBy: "createdAt",
      sortOrder: "asc",
    });
  });

  it("calculates the offset and preserves requested sorting", () => {
    expect(
      paginationHelpers.calculatePagination({
        page: 3,
        limit: 5,
        sortBy: "date",
        sortOrder: "desc",
      })
    ).toEqual({
      page: 3,
      limit: 5,
      skip: 10,
      sortBy: "date",
      sortOrder: "desc",
    });
  });
});