import { queryOptions } from "@tanstack/react-query"
import { jsonApiInstance } from "../api-instance"
import type { Order } from "@/types"

const RESOURCE = "orders"

export const ordersApi = {
  baseKey: RESOURCE,
  get: () => {
    return queryOptions({
      queryKey: [ordersApi.baseKey],
      queryFn: (meta) =>
        jsonApiInstance<{ orders: Order[] }>(`/${RESOURCE}/my-orders`, {
          signal: meta.signal,
        }),
    })
  },

  create: () => {
    return jsonApiInstance(`/${RESOURCE}/create`, {
      method: "POST",
    })
  },
}
