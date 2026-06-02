import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query"
import { jsonApiInstance } from "../api-instance"
import type { Category, Product, PaginatedData } from "@/types"
import { queryClient } from "../query-client"
import { productsApi } from "../products"

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

  getCategoryProductsInfinityQueryOptions: (categorySlug: string) => {
    return infiniteQueryOptions({
      queryKey: [categoriesApi.baseKey, categorySlug, "products"],
      queryFn: (meta) =>
        jsonApiInstance<PaginatedData<Product>>(
          `/${RESOURCE}/${categorySlug}/products?page=${meta.pageParam}&limit=10`,
          { signal: meta.signal }
        ),
      initialPageParam: 1,
      getNextPageParam: (result) =>
        result.page < result.totalPages ? result.page + 1 : null,
      select: (result) => {
        result.pages.forEach((page) => {
          page.data.forEach((product) => {
            queryClient.setQueryData(
              [productsApi.baseKey, product.slug],
              product
            )
          })
        })

        return result.pages.flatMap((page) => page.data)
      },
    })
  },
}
