import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Product, ProductVariant } from "@/types"
import { useEffect } from "react"

type FormValues = {
  productId: string
  variantId: string
  size: string
}

export default function ProductForm({
  product,
  selectedVariant,
}: {
  product: Product
  selectedVariant: ProductVariant
}) {
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

  const currentVariant =
    product.variants.find((v) => v.id === variantId) || selectedVariant

  const setVariant = (id: string) => {
    setValue("variantId", id)
    setValue("size", "")

    navigate(`/products/${product.slug}?variant=${id}`, { replace: true })
  }

  const onSubmit = (values: FormValues) => {
    console.log({
      ...values,
    })
  }

  useEffect(() => {
    reset({
      productId: product.id,
      variantId: selectedVariant.id,
      size: "",
    })
  }, [product.id, selectedVariant.id, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* COLORS (RADIO STYLE) */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            {currentVariant.color.name.toUpperCase()}
          </h3>

          <div className="flex gap-2">
            {product.variants.map((v) => {
              const isActive = v.id === variantId

              return (
                <label key={v.id}>
                  <input
                    type="radio"
                    name="variant"
                    value={v.id}
                    checked={isActive}
                    onChange={() => setVariant(v.id)}
                    className="hidden"
                  />

                  <div
                    className={cn(
                      "h-8 w-8 transition",
                      isActive
                        ? "ring-1 ring-foreground ring-offset-1 ring-offset-background"
                        : "hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background"
                    )}
                    style={{ backgroundColor: v.color.code }}
                  />
                </label>
              )
            })}
          </div>
        </div>

        {/* SIZES (RADIO STYLE) */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Sizes</h3>

          <div className="flex flex-wrap gap-2">
            {currentVariant.sizes.map((s) => {
              const isSelected = size === s.size
              const isOutOfStock = s.stock <= 0

              return (
                <label key={s.size}>
                  <input
                    type="radio"
                    name="size"
                    value={s.size}
                    disabled={isOutOfStock}
                    checked={isSelected}
                    onChange={() =>
                      setValue("size", s.size, { shouldValidate: true })
                    }
                    className="hidden"
                  />

                  <div
                    className={cn(
                      "h-8 w-8 bg-card text-center text-xs leading-8 transition",
                      isSelected
                        ? "ring-1 ring-foreground ring-offset-1 ring-offset-background"
                        : "hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background"
                    )}
                  >
                    {s.size}
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* SUBMIT */}
        <Button type="submit" disabled={!size} className="w-full">
          {!size ? "Select a size" : "Add to cart"}
        </Button>
      </div>
    </form>
  )
}
