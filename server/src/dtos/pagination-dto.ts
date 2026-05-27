export type PaginationDTO<T> = {
  data: T[];
  page: number;
  total: number;
  totalPages: number;
};

export const paginationDTO = <T>({
  data,
  page,
  total,
  totalPages,
}: PaginationDTO<T>): PaginationDTO<T> => {
  return {
    data,
    page,
    total,
    totalPages,
  };
};
