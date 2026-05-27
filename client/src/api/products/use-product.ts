import { useSuspenseQuery } from "@tanstack/react-query"
import { productsApi } from "."

export function useProduct(productSlug: string) {
  const { data: product, refetch } = useSuspenseQuery({
    ...productsApi.get(productSlug),
  })

  return { product, refetch }
}
