import { Link } from "react-router-dom"
import type { Product } from "@/types"
import { Skeleton } from "./ui/skeleton"
import Image from "./image"

type Props = {
  product?: Product
  isLoading?: boolean
}

export default function ProductCard({ product, isLoading }: Props) {
  if (isLoading || !product) {
    return (
      <div className="pb-5">
        <Skeleton className="mb-3 aspect-3/4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }

  return (
    <Link
      to={`/products/${product.slug}?variant=${encodeURIComponent(product.variants[0].id)}`}
      className="group block space-y-3 pb-5"
    >
      <div className="aspect-3/4 w-full">
        <Image
          src={product.variants[0].image}
          alt={`${product.name} ${product.variants[0].color.name}`}
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-medium md:text-sm lg:text-lg">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground md:text-sm lg:text-lg">
          ${product.price}
        </p>
      </div>
    </Link>
  )
}
