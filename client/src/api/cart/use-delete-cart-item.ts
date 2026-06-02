import { useMutation } from "@tanstack/react-query"
import { cartApi } from "."
import { queryClient } from "../query-client"
import type { Cart } from "@/types"

export function useDeleteCartItem() {
  const deleteCartItemMutation = useMutation({
    mutationFn: cartApi.deleteCartItem,
    onSuccess: (_, itemId) => {
      queryClient.setQueryData(
        [cartApi.baseKey],
        (oldData: Cart | undefined) => {
          if (!oldData) return oldData

          const item = oldData.items.find((item) => item.id === itemId)

          if (!item) return oldData

          return {
            ...oldData,
            itemsCount: oldData.itemsCount - item.quantity,
            total: oldData.total - item.price * item.quantity,
            items: oldData.items.filter((item) => item.id !== itemId),
          }
        }
      )

      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] })
    },
  })

  const handleDeleteCartItem = (itemId: string) => {
    deleteCartItemMutation.mutate(itemId)
  }

  return {
    handleDeleteCartItem,
    deleteCartItemIsPending: deleteCartItemMutation.isPending,
    deleteCartItemError: deleteCartItemMutation.error,
  }
}
