import { useInfiniteQuery } from "@tanstack/react-query"
import { categoriesApi } from "."
import { useCallback, useRef } from "react"

export function useCategoryProducts(categorySlug?: string) {
  const {
    data: products,
    isLoading,
    fetchNextPage,
  } = useInfiniteQuery({
    ...categoriesApi.getCategoryProductsInfinityQueryOptions(categorySlug!),
    enabled: !!categorySlug,
  })

  const cursorRef = useIntersection(() => {
    fetchNextPage()
  })

  return { products, isLoading, cursorRef }
}

export function useIntersection(onIntersect: () => void) {
  const unsubscribe = useRef(() => {})

  return useCallback((el: HTMLDivElement | null) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((intersection) => {
        if (intersection.isIntersecting) {
          onIntersect()
        }
      })
    })

    if (el) {
      observer.observe(el)
      unsubscribe.current = () => observer.disconnect()
    } else {
      unsubscribe.current()
    }
  }, [])
}
