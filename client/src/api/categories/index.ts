import { queryOptions } from "@tanstack/react-query"
import { jsonApiInstance } from "../api-instance"
import type { Category, Product, PaginatedData } from "@/types"

const RESOURCE = "categories"

export const categoriesApi = {
  baseKey: RESOURCE,
  get: () => {
    return queryOptions({
      queryKey: [categoriesApi.baseKey, "list"],
      queryFn: (meta) =>
        jsonApiInstance<Category[]>(`/${RESOURCE}`, {
          signal: meta.signal,
        }),
    })
  },
  getCategoryProducts: (categorySlug: string, page = 1, limit = 10) => {
    return queryOptions({
      queryKey: [categoriesApi.baseKey, categorySlug, "products"],
      queryFn: (meta) =>
        jsonApiInstance<PaginatedData<Product>>(
          `/${RESOURCE}/${categorySlug}/products?page=${page}&limit=${limit}`,
          { signal: meta.signal }
        ),
    })
  },
}
