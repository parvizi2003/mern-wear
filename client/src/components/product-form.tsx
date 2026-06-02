import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { Product, ProductVariant } from "@/types"
import { useAddItemToCart } from "@/api/cart/use-add-item-to-cart"
import ProductSizeSelector from "./product-size-selector"
import ProductColorSelector from "./product-color-selector"
import { useEffect } from "react"
import { useCart } from "@/api/cart/use-cart"
import { useIncreaseCartItemQuantity } from "@/api/cart/use-increase-cart-item-quantity"
import { useDecreaseCartItemQuantity } from "@/api/cart/use-decrease-cart-item-quantity"
import { Loader2, Minus, Plus } from "lucide-react"

type FormValues = {
  productId: string
  variantId: string
  size: string
}

type ProductFormProps = {
  product: Product
  selectedVariant: ProductVariant
}

export default function ProductForm({
  product,
  selectedVariant,
}: ProductFormProps) {
  const { cart } = useCart()
  const { handleAddItemToCart, addItemIsPending } = useAddItemToCart()
  const { handleDecreaseCartItemQuantity, decreaseCartItemIsPending } =
    useDecreaseCartItemQuantity()
  const { handleIncreaseCartItemQuantity, increaseCartItemIsPending } =
    useIncreaseCartItemQuantity()
  const navigate = useNavigate()

  const { watch, setValue, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      productId: product.id,
      variantId: selectedVariant.id,
      size: "",
    },
  })

  const variantId = watch("variantId")
  const size = watch("size")

  const cartItem = cart?.items.find(
    (item) =>
      item.product === product.id &&
      item.variant === variantId &&
      item.size === size
  )

  const currentVariant =
    product.variants.find((v) => v.id === variantId) || selectedVariant

  const onSubmit = (values: FormValues) => {
    handleAddItemToCart(values)
  }

  useEffect(() => {
    reset({
      productId: product.id,
      variantId: selectedVariant.id,
      size: "",
    })
  }, [selectedVariant.id, product.id, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ProductColorSelector
        product={product}
        variantId={variantId}
        onChange={(id) => {
          setValue("variantId", id)
          setValue("size", "")
          navigate(`?variant=${id}`, { replace: true })
        }}
      />

      <ProductSizeSelector
        sizes={currentVariant.sizes}
        value={size}
        onChange={(s) => setValue("size", s)}
      />

      {cartItem ? (
        <div className="flex w-full items-center justify-center gap-4 bg-primary p-1 text-primary-foreground">
          <Button
            type="button"
            size="icon-sm"
            onClick={() => handleDecreaseCartItemQuantity(cartItem.id)}
            disabled={decreaseCartItemIsPending}
            className="bg-primary-foreground text-primary"
          >
            {decreaseCartItemIsPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Minus size={16} />
            )}
          </Button>

          <span>{cartItem.quantity}</span>

          <Button
            type="button"
            size="icon-sm"
            onClick={() => handleIncreaseCartItemQuantity(cartItem.id)}
            disabled={increaseCartItemIsPending}
            className="bg-primary-foreground text-primary"
          >
            {increaseCartItemIsPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
          </Button>
        </div>
      ) : (
        <Button
          type="submit"
          disabled={!size || addItemIsPending}
          className="w-full"
        >
          {!size ? (
            "Select a size"
          ) : addItemIsPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Add to cart"
          )}
        </Button>
      )}
    </form>
  )
}
