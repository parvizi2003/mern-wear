import { useMutation } from "@tanstack/react-query"
import { ordersApi } from "."
import { queryClient } from "../query-client"
import { cartApi } from "../cart"

export function useCreateOrder() {
  const createOrderMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ordersApi.baseKey] })
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] })
    },
  })

  const handleCreateOrder = () => {
    createOrderMutation.mutate()
  }

  return {
    handleCreateOrder,
    createOrderIsPending: createOrderMutation.isPending,
    createOrderError: createOrderMutation.error,
  }
}
