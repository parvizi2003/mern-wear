import { queryOptions } from "@tanstack/react-query"
import { jsonApiInstance } from "../api-instance"
import type { Cart } from "@/types"

const RESOURCE = "cart"

export const cartApi = {
  baseKey: RESOURCE,
  get: () => {
    return queryOptions({
      queryKey: [cartApi.baseKey],
      queryFn: (meta) =>
        jsonApiInstance<Cart>(`/${RESOURCE}`, {
          signal: meta.signal,
        }),
    })
  },
  addItemToCart: (formData?: {
    productId: string
    variantId: string
    size: string
  }) => {
    return jsonApiInstance(`/${RESOURCE}/items`, {
      method: "POST",
      json: formData,
    })
  },
  increaseCartItemQuantity: (itemId: string) => {
    return jsonApiInstance(`/${RESOURCE}/items/${itemId}/increase`, {
      method: "PATCH",
    })
  },
  decreaseCartItemQuantity: (itemId: string) => {
    return jsonApiInstance(`/${RESOURCE}/items/${itemId}/decrease`, {
      method: "PATCH",
    })
  },
  deleteCartItem: (itemId: string) => {
    return jsonApiInstance(`/${RESOURCE}/items/${itemId}`, {
      method: "DELETE",
    })
  },
  clearCart: () => {
    return jsonApiInstance(`/${RESOURCE}`, {
      method: "DELETE",
    })
  },
}
