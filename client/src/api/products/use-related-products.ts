import { useQuery } from "@tanstack/react-query"
import { productsApi } from "."

export function useRelatedProducts(productSlug: string) {
  const { data: products, isLoading } = useQuery({
    ...productsApi.getRelatedProducts(productSlug),
  })

  return { products, isLoading }
}
