import { useQuery } from "@tanstack/react-query"
import { productsApi } from "."

export function useProductsByCategory(categoryName?: string) {
  const query = useQuery({
    queryKey: ["products", categoryName],

    queryFn: ({ signal }) =>
      productsApi.getProductsByCategory(categoryName!, signal),

    enabled: !!categoryName,
    retry: false,
  })

  return {
    products: query.data?.products,
    isLoading: query.isLoading,
  }
}
