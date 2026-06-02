import type { CartItem } from "@/types"
import { Button } from "./ui/button"
import { Loader2, Minus, Plus, Trash2 } from "lucide-react"
import { useProduct } from "@/api/products/use-product"
import Image from "./image"
import { useDecreaseCartItemQuantity } from "@/api/cart/use-decrease-cart-item-quantity"
import { useIncreaseCartItemQuantity } from "@/api/cart/use-increase-cart-item-quantity"
import { useDeleteCartItem } from "@/api/cart/use-delete-cart-item"
import { cn } from "@/lib/utils"

export default function CartItem({
  item,
  className,
}: {
  item: CartItem
  className?: string
}) {
  const { handleDecreaseCartItemQuantity, decreaseCartItemIsPending } =
    useDecreaseCartItemQuantity()
  const { handleIncreaseCartItemQuantity, increaseCartItemIsPending } =
    useIncreaseCartItemQuantity()
  const { handleDeleteCartItem, deleteCartItemIsPending } = useDeleteCartItem()
  const { product } = useProduct(item.productSlug)
  const variant = product?.variants.find((v) => v.id === item.variant)

  if (!product || !variant) return null

  return (
    <div className={cn(className, "border-b py-4")}>
      <div className="flex items-center justify-between">
        <div className="aspect-3/4 h-30">
          <Image src={variant.image} alt={product.name} />
        </div>
        <div className="flex flex-1 flex-col gap-1 pl-4">
          <div className="font-semibold">{product.name}</div>
          <div className="text-sm text-muted-foreground">
            {variant.color.name}, {item.size}
          </div>
          <div>${(item.price * item.quantity).toFixed(2)}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => handleDecreaseCartItemQuantity(item.id)}
                disabled={decreaseCartItemIsPending}
              >
                {decreaseCartItemIsPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Minus size={16} />
                )}
              </Button>

              <span>{item.quantity}</span>

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => handleIncreaseCartItemQuantity(item.id)}
                disabled={increaseCartItemIsPending}
              >
                {increaseCartItemIsPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
              </Button>
            </div>

            <Button
              variant="destructive"
              size="icon-sm"
              onClick={() => handleDeleteCartItem(item.id)}
              disabled={deleteCartItemIsPending}
            >
              {deleteCartItemIsPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
