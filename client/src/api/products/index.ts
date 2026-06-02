import type { Product } from "@/types"
import { jsonApiInstance } from "../api-instance"
import { queryOptions } from "@tanstack/react-query"

const RESOURCE = "products"

export const productsApi = {
  baseKey: RESOURCE,
  get: (productSlug: string) => {
    return queryOptions({
      queryKey: [productsApi.baseKey, productSlug],
      queryFn: (meta) =>
        jsonApiInstance<Product>(`/${RESOURCE}/${productSlug}`, {
          signal: meta.signal,
        }),
    })
  },
  search: (query: string) => {
    return queryOptions({
      queryKey: [productsApi.baseKey, "search", query],
      queryFn: (meta) =>
        jsonApiInstance<Product[]>(
          `/${RESOURCE}/search?q=${encodeURIComponent(query)}`,
          {
            signal: meta.signal,
          }
        ),
    })
  },
  getNewProducts: () => {
    return queryOptions({
      queryKey: [productsApi.baseKey, "new"],
      queryFn: (meta) =>
        jsonApiInstance<Product[]>(`/${RESOURCE}/new`, {
          signal: meta.signal,
        }),
    })
  },
  getRelatedProducts: (productSlug: string) => {
    return queryOptions({
      queryKey: [productsApi.baseKey, productSlug, "related"],
      queryFn: (meta) =>
        jsonApiInstance<Product[]>(`/${RESOURCE}/${productSlug}/related`, {
          signal: meta.signal,
        }),
    })
  },
}
