import { useMutation } from "@tanstack/react-query"
import { cartApi } from "."
import { queryClient } from "../query-client"

export function useAddItemToCart() {
  const addItemMutation = useMutation({
    mutationFn: cartApi.addItemToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] })
    },
  })

  const handleAddItemToCart = (formData: {
    productId: string
    variantId: string
    size: string
  }) => {
    addItemMutation.mutate(formData)
  }

  return {
    handleAddItemToCart,
    addItemIsPending: addItemMutation.isPending,
    addItemError: addItemMutation.error,
  }
}
