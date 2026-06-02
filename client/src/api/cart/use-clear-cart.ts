import { useMutation } from "@tanstack/react-query"
import { cartApi } from "."
import { queryClient } from "../query-client"

export function useClearCart() {
  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] })
    },
  })

  const handleClearCart = () => {
    clearCartMutation.mutate()
  }

  return {
    handleClearCart,
    clearCartIsPending: clearCartMutation.isPending,
    clearCartError: clearCartMutation.error,
  }
}
