import { categoriesApi } from "@/api/categories"
import { useSuspenseQuery } from "@tanstack/react-query"

export function useCategories() {
  const { data: categories, refetch } = useSuspenseQuery({
    ...categoriesApi.get(),
  })

  return { categories, refetch }
}
