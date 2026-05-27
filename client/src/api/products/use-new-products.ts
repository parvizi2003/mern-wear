import { useQuery } from "@tanstack/react-query"
import { productsApi } from "."

export function useNewProducts() {
  const { data: products, isLoading } = useQuery({
    ...productsApi.getNewProducts(),
  })

  return { products, isLoading }
}
