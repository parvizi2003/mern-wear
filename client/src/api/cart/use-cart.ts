import { useQuery } from "@tanstack/react-query"
import { cartApi } from "."

export function useCart() {
  const { data: cart, isLoading } = useQuery({
    ...cartApi.get(),
  })

  return { cart, isLoading }
}
