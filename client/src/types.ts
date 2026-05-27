export type User = {
  _id: string
  name: string
  email: string
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
