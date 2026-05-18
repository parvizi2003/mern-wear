import { jsonApiInstance } from "../api-instance"

const RESOURCE = "products"

export interface Product {
  id: number
  name: string
  price: number
  category: string
}

export const productsApi = {
  getProductsByCategory: (categoryName: string, signal?: AbortSignal) => {
    return jsonApiInstance<{ products: Product[] }>(
      `/${RESOURCE}?category=${categoryName}`,
      { signal }
    )
  },
}
