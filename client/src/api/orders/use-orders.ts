import { useQuery } from "@tanstack/react-query"
import { ordersApi } from "."

export function useOrders() {
  const { data, isLoading } = useQuery({
    ...ordersApi.get(),
  })

  return { orders: data?.orders, isLoading }
}
