import { useQuery } from "@tanstack/react-query"
import { categoriesApi } from "."

export function useCategoryProducts({
  categorySlug,
  page,
  limit,
}: {
  categorySlug: string
  page?: number
  limit?: number
}) {
  const { data: products, isLoading } = useQuery({
    ...categoriesApi.getCategoryProducts(categorySlug!, page, limit),
    enabled: !!categorySlug,
  })

  return { products, isLoading }
}
