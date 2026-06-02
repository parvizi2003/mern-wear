import { useMutation } from "@tanstack/react-query"
import { cartApi } from "."
import { queryClient } from "../query-client"
import type { Cart } from "@/types"

export function useDecreaseCartItemQuantity() {
  const decreaseCartItemMutation = useMutation({
    mutationFn: cartApi.decreaseCartItemQuantity,
    onSuccess: (_, itemId) => {
      queryClient.setQueryData(
        [cartApi.baseKey],
        (oldData: Cart | undefined) => {
          if (!oldData) return oldData

          const item = oldData.items.find((item) => item.id === itemId)

          if (!item) return oldData

          return {
            ...oldData,
            itemsCount: oldData.itemsCount - 1,
            total: oldData.total - item.price,
            items:
              item.quantity === 1
                ? oldData.items.filter((item) => item.id !== itemId)
                : oldData.items.map((item) =>
                    item.id === itemId
                      ? { ...item, quantity: item.quantity - 1 }
                      : item
                  ),
          }
        }
      )

      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] })
    },
  })

  const handleDecreaseCartItemQuantity = (itemId: string) => {
    decreaseCartItemMutation.mutate(itemId)
  }

  return {
    handleDecreaseCartItemQuantity,
    decreaseCartItemIsPending: decreaseCartItemMutation.isPending,
    decreaseCartItemError: decreaseCartItemMutation.error,
  }
}
