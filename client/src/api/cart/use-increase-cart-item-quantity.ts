import { useMutation } from "@tanstack/react-query"
import { cartApi } from "."
import { queryClient } from "../query-client"
import type { Cart } from "@/types"

export function useIncreaseCartItemQuantity() {
  const increaseCartItemMutation = useMutation({
    mutationFn: cartApi.increaseCartItemQuantity,
    onSuccess: (_, itemId) => {
      queryClient.setQueryData(
        [cartApi.baseKey],
        (oldData: Cart | undefined) => {
          if (!oldData) return oldData

          const item = oldData.items.find((item) => item.id === itemId)

          if (!item) return oldData

          return {
            ...oldData,
            itemsCount: oldData.itemsCount + 1,
            total: oldData.total + item.price,
            items: oldData.items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }
        }
      )

      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] })
    },
  })

  const handleIncreaseCartItemQuantity = (itemId: string) => {
    increaseCartItemMutation.mutate(itemId)
  }

  return {
    handleIncreaseCartItemQuantity,
    increaseCartItemIsPending: increaseCartItemMutation.isPending,
    increaseCartItemError: increaseCartItemMutation.error,
  }
}
