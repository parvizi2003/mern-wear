import { useQuery } from "@tanstack/react-query"
import { productsApi } from "."

export function useSearchProducts(query: string) {
  const { data: products, isLoading } = useQuery({
    ...productsApi.search(query),
    enabled: query.trim().length > 0,
  })

  return { products, isLoading }
}
