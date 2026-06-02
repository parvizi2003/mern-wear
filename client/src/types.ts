export type User = {
  id: string
  name: string
  email: string
}

export interface OrderItem {
  id: string
  order: string
  product: string
  variant: string
  productName: string
  color: string
  size: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  user: string
  userEmail: string
  itemsCount: number
  total: number
  status: "pending" | "success" | "cancelled"
  items: OrderItem[]
}

export interface CartItem {
  id: string
  product: string
  productSlug: string
  variant: string
  size: string
  quantity: number
  price: number
}

export interface Cart {
  id: string
  itemsCount: number
  total: number
  items: CartItem[] | []
}

export interface Category {
  id: number
  name: string
  slug: string
}

export type PaginatedData<T> = {
  data: T[]

  page: number
  total: number
  totalPages: number
}

export type ProductSize = {
  size: string
  stock: number
}

export type ProductVariant = {
  id: string

  color: {
    name: string
    code: string
  }

  image: string

  sizes: ProductSize[]
}

export type Product = {
  id: string

  name: string
  slug: string
  description: string

  price: number
  category: string

  variants: ProductVariant[]
}
