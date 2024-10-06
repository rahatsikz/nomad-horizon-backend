import { IPaginationOptions } from "../interface/pagination";

const calculatePagination = (options: IPaginationOptions) => {
  const page = Number(options.page || 1);
  const size = Number(options.size || 10);

  const skip = (page - 1) * size;

  return {
    page,
    size,
    skip,
  };
};

export const paginationHelpers = {
  calculatePagination,
};
